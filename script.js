const classList = document.getElementById("class-list");
const classTemplate = document.getElementById("class-template");
const addClassButton = document.getElementById("add-class-button");
const scheduleForm = document.getElementById("schedule-form");
const output = document.getElementById("output");

// These keywords help us estimate whether a class sounds lighter or heavier.
const difficultyKeywords = {
  hard: [
    "exam",
    "exams",
    "quiz",
    "quizzes",
    "lab",
    "labs",
    "project",
    "projects",
    "paper",
    "papers",
    "presentation",
    "presentations",
    "group work",
    "midterm",
    "midterms",
    "final",
    "finals",
    "strict",
    "heavy",
    "difficult",
    "time-consuming",
  ],
  easy: [
    "open book",
    "flexible",
    "clear",
    "helpful",
    "manageable",
    "organized",
    "straightforward",
    "light",
    "easy",
    "supportive",
    "lenient",
    "fair",
  ],
};

addClassButton.addEventListener("click", () => {
  addClassCard();
});

scheduleForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const classes = collectClasses();
  if (classes.length === 0) {
    output.textContent = "Add at least one class to see the evaluation.";
    return;
  }

  const result = evaluateSchedule(classes);
  output.textContent = formatResult(result);
});

// Create a new class card in the form.
function addClassCard(defaultValues = {}) {
  const fragment = classTemplate.content.cloneNode(true);
  const classEntry = fragment.querySelector(".class-entry");

  classEntry.querySelector('input[name="name"]').value = defaultValues.name || "";
  classEntry.querySelector('input[name="credits"]').value = defaultValues.credits || "";
  classEntry.querySelector('textarea[name="syllabus"]').value =
    defaultValues.syllabus || "";
  classEntry.querySelector('textarea[name="reviews"]').value =
    defaultValues.reviews || "";

  classEntry.querySelector(".remove-button").addEventListener("click", () => {
    classEntry.remove();

    if (classList.children.length === 0) {
      addClassCard();
    }
  });

  classList.appendChild(fragment);
}

// Read every visible class card and turn it into simple JavaScript data.
function collectClasses() {
  const classEntries = Array.from(document.querySelectorAll(".class-entry"));

  return classEntries
    .map((entry) => {
      const name = entry.querySelector('input[name="name"]').value.trim();
      const credits = Number(entry.querySelector('input[name="credits"]').value);
      const syllabus = entry.querySelector('textarea[name="syllabus"]').value.trim();
      const reviews = entry.querySelector('textarea[name="reviews"]').value.trim();

      return { name, credits, syllabus, reviews };
    })
    .filter((course) => course.name && course.credits > 0);
}

// Build the final schedule analysis from all of the entered classes.
function evaluateSchedule(classes) {
  const ratedClasses = classes.map((course) => {
    const ratingNumber = getClassRating(course);
    const ratingEmoji = getClassEmoji(ratingNumber);
    const weeklyHours = course.credits * 4;

    return {
      ...course,
      ratingNumber,
      ratingEmoji,
      weeklyHours,
      summary: buildClassSummary(course, ratingNumber),
    };
  });

  const totalWeeklyHours = ratedClasses.reduce(
    (sum, course) => sum + course.weeklyHours,
    0
  );

  const overallDifficultyPoints = ratedClasses.reduce(
    (sum, course) => sum + course.ratingNumber,
    0
  );

  return {
    totalWeeklyHours,
    ratedClasses,
    overallRating: getOverallScheduleRating(overallDifficultyPoints),
    pros: buildPros(ratedClasses),
    cons: buildCons(ratedClasses),
  };
}

// Estimate a 1, 2, or 3 rating from credit hours plus optional notes.
function getClassRating(course) {
  let score = 0;
  const combinedText = `${course.syllabus} ${course.reviews}`.toLowerCase();

  // Credit hours are the main driver because each credit stands in for
  // a steady amount of weekly work.
  if (course.credits <= 2) {
    score += 1;
  } else if (course.credits === 3) {
    score += 2;
  } else {
    score += 3;
  }

  for (const keyword of difficultyKeywords.hard) {
    if (combinedText.includes(keyword)) {
      score += 1;
    }
  }

  for (const keyword of difficultyKeywords.easy) {
    if (combinedText.includes(keyword)) {
      score -= 1;
    }
  }

  if (score <= 2) {
    return 1;
  }

  if (score <= 5) {
    return 2;
  }

  return 3;
}

function getClassEmoji(ratingNumber) {
  if (ratingNumber === 1) {
    return "🔵";
  }

  if (ratingNumber === 2) {
    return "🟢";
  }

  return "🟡";
}

// Write a single sentence that explains the rating in plain language.
function buildClassSummary(course, ratingNumber) {
  const textParts = [course.syllabus, course.reviews].filter(Boolean);
  const courseNotes = textParts.join(" ").toLowerCase();

  if (ratingNumber === 1) {
    if (courseNotes) {
      return "looks light overall, and the notes suggest a manageable week-to-week pace.";
    }

    return "looks light overall because the credit load is on the smaller side.";
  }

  if (ratingNumber === 2) {
    if (courseNotes.includes("project") || courseNotes.includes("paper")) {
      return "has a steady workload with a few larger assignments to plan around.";
    }

    return "has a steady workload that should stay manageable with regular study time.";
  }

  if (courseNotes.includes("lab") || courseNotes.includes("exam")) {
    return "looks demanding because the course notes point to heavier graded work.";
  }

  return "looks demanding and will likely need extra attention throughout the week.";
}

// Convert the total schedule points into the required flame label.
function getOverallScheduleRating(points) {
  if (points <= 5) {
    return "🔥 very easy";
  }

  if (points <= 10) {
    return "🔥🔥 easy";
  }

  if (points <= 15) {
    return "🔥🔥🔥 moderate";
  }

  if (points <= 20) {
    return "🔥🔥🔥🔥 difficult";
  }

  return "🔥🔥🔥🔥🔥 very difficult";
}

function buildPros(ratedClasses) {
  const pros = [];
  const totalCredits = ratedClasses.reduce((sum, course) => sum + course.credits, 0);
  const lighterClasses = ratedClasses.filter((course) => course.ratingNumber === 1);
  const moderateOrLower = ratedClasses.filter((course) => course.ratingNumber <= 2);

  if (lighterClasses.length > 0) {
    pros.push("Includes at least one class that looks relatively manageable.");
  }

  if (moderateOrLower.length === ratedClasses.length) {
    pros.push("The schedule appears balanced without any class rated at the highest level.");
  }

  if (totalCredits <= 12) {
    pros.push("The credit load is light enough to leave room for other commitments.");
  }

  if (pros.length === 0) {
    pros.push("The schedule can still feel workable if you stay organized from the start.");
  }

  return pros;
}

function buildCons(ratedClasses) {
  const cons = [];
  const demandingClasses = ratedClasses.filter((course) => course.ratingNumber === 3);
  const totalWeeklyHours = ratedClasses.reduce(
    (sum, course) => sum + course.weeklyHours,
    0
  );

  if (demandingClasses.length > 0) {
    cons.push("One or more classes look demanding and may create stressful weeks.");
  }

  if (totalWeeklyHours >= 40) {
    cons.push("The weekly time commitment is high and may be hard to maintain consistently.");
  }

  if (demandingClasses.length >= 2) {
    cons.push("Multiple higher-effort classes could make deadlines pile up at the same time.");
  }

  if (cons.length === 0) {
    cons.push("Even a manageable schedule can become busy when deadlines bunch together.");
  }

  return cons;
}

// Produce the exact text layout requested by the prompt.
function formatResult(result) {
  const classRatings = result.ratedClasses
    .map((course) => `- ${course.name}: ${course.ratingEmoji} ${course.summary}`)
    .join("\n");

  const pros = result.pros.map((item) => `- ${item}`).join("\n");
  const cons = result.cons.map((item) => `- ${item}`).join("\n");

  return `Total weekly time required: ${result.totalWeeklyHours} hours

Class ratings:
${classRatings}

Overall schedule rating: ${result.overallRating}

Pros:
${pros}

Cons:
${cons}`;
}

// Add one blank card so the page is ready to use right away.
addClassCard({
  name: "",
  credits: "",
  syllabus: "",
  reviews: "",
});
