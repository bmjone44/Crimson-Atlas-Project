# MVP Report: ASU Schedule Difficulty Analyzer

## 1. Executive Summary

### Problem

College students often build schedules by looking only at credit hours, but credit hours do not always reflect how hard a semester will feel. A schedule with multiple STEM courses, labs, projects, compressed sessions, or exam-heavy classes can become difficult even if the total number of credits looks reasonable. Students may also struggle to compare classes because syllabus details and student comments are usually scattered across different places.

### Solution

Our MVP is a browser-based ASU Schedule Difficulty Analyzer that helps students estimate the workload and difficulty of a planned schedule. The user enters course names, credit hours, and optional syllabus or student-review notes. The page then produces a structured schedule report with total estimated weekly time, individual class difficulty ratings, an overall schedule difficulty rating, and short pros and cons.

### What the MVP Actually Does

The MVP is a single self-contained HTML page that runs entirely in the browser. It does not require a backend, database, login system, or API key. The current version supports:

- Quick entry of multiple classes using a simple text box.
- Class cards for editing course name, credits, school, session, format, syllabus notes, review notes, and workload flags.
- ASU as the default school when no school is provided.
- ASU-focused STEM detection using course prefixes and STEM-related terms.
- A rule-based difficulty score for each class from 1 to 4.
- A total weekly time estimate using 4 hours per credit hour.
- An overall schedule difficulty label using flame and water-drop emojis.
- A serious advisor-style report with pros and cons.
- Print support for saving or sharing the final report.

The MVP is designed to be lightweight, easy to open, and easy to demo from GitHub Pages or a local browser.

### MVP Access and Demo Link

Viewers can use the HTML page directly if it is hosted with GitHub Pages. If the file is only clicked from the normal GitHub repository file view, GitHub will usually show the HTML source code instead of running it as a webpage. For the best demo experience, the project should be deployed with GitHub Pages and the report should include the live link.

Recommended file setup:

```text
/repo-root
  index.html
  /mvp
    report.md
```

Recommended live demo link format after enabling GitHub Pages:

```text
https://YOUR-GITHUB-USERNAME.github.io/YOUR-REPO-NAME/
```

If the HTML file is not renamed to `index.html`, the live demo link should include the file name instead:

```text
https://YOUR-GITHUB-USERNAME.github.io/YOUR-REPO-NAME/asu_schedule_analyzer.html
```

### How to Use the MVP

1. Open the live GitHub Pages link or open the HTML file locally in a browser.
2. Enter classes in the quick-add box using the format `COURSE, credits`.

   Example:

   ```text
   CSE 110, 3
   MAT 265, 3
   ENG 101, 3
   BIO 181, 4
   ```

3. Click **Create class cards** to turn the class list into editable entries.
4. Add optional syllabus notes or student-review notes if available.
5. Select any workload flags that apply, such as lab, writing-heavy, project-heavy, or exam-heavy.
6. Click **Analyze schedule**.
7. Review the generated report, including total estimated weekly time, individual class ratings, overall schedule difficulty, pros, and cons.
8. Use the print button to save or share the report as needed.

### How to Deploy on GitHub Pages

1. Add the HTML file to the repository. For the easiest link, rename it to `index.html` and place it in the root of the repo.
2. Place this report at `/mvp/report.md`.
3. Go to the repository on GitHub.
4. Open **Settings**.
5. Select **Pages** in the left sidebar.
6. Under **Build and deployment**, choose **Deploy from a branch**.
7. Select the `main` branch and the `/root` folder.
8. Click **Save**.
9. After GitHub finishes deploying, copy the GitHub Pages URL and add it to the report or README.

## 2. User & Use Case

### Primary User Persona

**Persona:** ASU undergraduate student planning a semester schedule  
**Goal:** Avoid building a schedule that looks manageable by credits but becomes overwhelming in practice  
**Pain Point:** The student may know the class names and credit hours but may not know how those classes interact as a full schedule  
**Context:** The student may be choosing classes before registration, comparing multiple possible schedules, or deciding whether to swap a course

### Usage Narrative

A student opens the schedule analyzer while planning next semester. They paste a list such as:

```text
CSE 110, 3
MAT 265, 3
ENG 101, 3
BIO 181, 4
```

The page converts those lines into editable class cards. The student can optionally add notes from syllabi or student comments, such as "weekly quizzes," "lab reports," "project-heavy," or "manageable workload." After clicking **Analyze schedule**, the page returns a structured report.

The report helps the student answer practical questions:

- How much time might this schedule require each week?
- Which classes are likely to create the most pressure?
- Is the overall schedule easy, moderate, difficult, or very difficult?
- What are the main advantages and risks of this schedule?

### Secondary Users

- **Academic advisors:** Could use the report as a quick conversation starter with students.
- **Peer mentors:** Could help first-year students understand workload tradeoffs.
- **Students comparing schedules:** Could generate reports for several schedule options and compare the results.

## 3. System Design

### High-Level Architecture

```text
+--------------------+
| User Inputs        |
|--------------------|
| Course name/code   |
| Credits            |
| School             |
| Session            |
| Format             |
| Syllabus notes     |
| Student reviews    |
| Workload flags     |
+---------+----------+
          |
          v
+--------------------+
| Input Parser       |
|--------------------|
| Quick-add parsing  |
| Form collection    |
| Default ASU school |
| Text cleanup       |
+---------+----------+
          |
          v
+-----------------------------+
| Rule-Based Evaluator        |
|-----------------------------|
| Credit-hour base rating     |
| ASU STEM prefix detection   |
| Keyword difficulty signals  |
| Session/format adjustments  |
| Rating clamp from 1 to 4    |
+-------------+---------------+
              |
              v
+-----------------------------+
| Schedule Aggregator         |
|-----------------------------|
| Total credits               |
| Estimated weekly hours      |
| Sum of class ratings        |
| Overall schedule label      |
| Pros and cons generation    |
+-------------+---------------+
              |
              v
+-----------------------------+
| Report Renderer             |
|-----------------------------|
| Weekly time                 |
| Individual ratings          |
| Overall rating              |
| Pros                        |
| Cons                        |
| Print-friendly report       |
+-----------------------------+
```

### Data Flow

1. The user enters classes manually or through the quick-add box.
2. The page converts each class into a structured object containing name, credits, school, session, format, notes, and flags.
3. The evaluator assigns a base difficulty rating from credit hours.
4. The evaluator adjusts the rating based on ASU STEM classification, high-difficulty signals, low-difficulty signals, writing-heavy flags, online format, and compressed sessions.
5. Ratings are clamped between 1 and 4.
6. The schedule-level evaluator calculates total estimated weekly time and assigns an overall difficulty label.
7. The report renderer displays the final output in the required format.

### Why This Design Fits the MVP

The project goal was to create a usable workload analyzer without requiring a full-stack application. Keeping the MVP as a browser-only page makes it easy to demo, easy to host, and easy to understand. It also avoids exposing API keys or storing student schedule data on a server.

## 4. Data

### Data Sources

The MVP uses three main types of data:

1. **User-entered schedule data**
   - Course names or codes
   - Credit hours
   - School name
   - Session type
   - Course format
   - Optional syllabus notes
   - Optional student-review notes
   - Optional workload flags such as lab, writing-heavy, project-heavy, or exam-heavy

2. **Built-in ASU-focused course heuristics**
   - A curated set of ASU-style STEM course prefixes such as CSE, MAT, PHY, CHM, BIO, EEE, SER, IFT, and others.
   - A list of STEM-related words such as biology, chemistry, physics, calculus, programming, engineering, data, science, and lab.

3. **Built-in workload signal keywords**
   - High-difficulty signals such as difficult, time-consuming, weekly quizzes, exams, lab reports, projects, coding, proof, no curve, mandatory attendance, research paper, and presentations.
   - Low-difficulty signals such as easy, light, manageable, straightforward, flexible, open-note, extra credit, no exams, minimal homework, relaxed, and clear grading.

### Data Size

This MVP does not use a large external dataset. It uses a small, curated ruleset embedded directly in the HTML file. Each user session creates a temporary schedule dataset based on the classes entered by the user. For example, a schedule with five classes creates five course objects for analysis.

### Data Cleaning

The page performs lightweight cleaning and normalization:

- Trims extra spaces from course names and notes.
- Assumes 3 credits when a quick-add line does not include credits.
- Assumes Arizona State University when no school is entered.
- Converts text to lowercase for keyword matching.
- Extracts course prefixes from course codes when possible.
- Ignores empty class cards or classes with invalid credit values.

### Data Splits

There is no train/test split in this MVP because it does not train a machine learning model. Instead, the project uses manual validation examples to check whether the rule-based evaluator behaves as expected. Future versions could collect anonymized user feedback or historical workload examples and then split that data into training, validation, and test sets.

## 5. Models

### Model Used in the MVP

The MVP uses a deterministic rule-based workload model rather than a trained machine learning model. The model is designed to match the requested class-rating format and to provide predictable results in a browser-only environment.

### Individual Class Rating Logic

Each class receives a difficulty rating from 1 to 4:

- **1 = 🔵**
- **2 = 🟢**
- **3 = 🟡**
- **4 = 🔴**

The base rating comes from credit hours:

- 1-2 credits: light load
- 3 credits: average load
- 4 or more credits: heavy load

The rating can then be adjusted based on workload signals:

- ASU STEM courses increase the rating.
- High-difficulty syllabus or student-review notes increase the rating.
- Lab, project-heavy, exam-heavy, compressed session, writing-heavy, or online course signals may increase the rating.
- Low-difficulty notes can decrease the rating.
- Final ratings are clamped between 1 and 4.

### Overall Schedule Rating Logic

The MVP adds the individual class ratings and maps the total to a final label:

- 1-5: 🔥💧💧 Very Easy
- 6-10: 🔥🔥💧 Easy
- 11-15: 🔥🔥🔥 Moderate
- 16-20: 🔥🔥🔥🔥 Difficult
- 21+: 🔥🔥🔥🔥🔥 Very Difficult

### Prompting or Workflow Strategy

The project originally framed the desired output like an AI prompt, but the MVP implements that prompt as deterministic browser logic. This choice makes the result faster, more private, and easier to deploy as a simple webpage. A future version could add a generative model to summarize syllabus text more deeply, but the MVP intentionally avoids dependency on an external AI API.

## 6. Evaluation

### Quantitative Evaluation

The MVP can be evaluated quantitatively by checking whether the calculations and labels follow the rubric exactly:

| Evaluation Area | Expected Behavior | MVP Behavior |
|---|---|---|
| Weekly time estimate | Total credits multiplied by 4 hours | The report shows only the final estimated weekly hours |
| Class difficulty range | Ratings must stay between 1 and 4 | The model clamps ratings to the 1-4 range |
| Difficulty emoji labels | 1 🔵, 2 🟢, 3 🟡, 4 🔴 | The report displays the required emoji and number |
| Overall schedule label | Uses rating-sum scale | The report maps the total score to the required flame/water label |
| Pros and cons length | Up to five bullets each | The report limits each list to five bullets |
| Default school | ASU when missing | Empty school fields default to Arizona State University |

### Example Test Case

Example input:

```text
CSE 110, 3
MAT 265, 3
ENG 101, 3
COM 100, 3
```

Expected qualitative behavior:

- CSE 110 and MAT 265 should be treated as ASU STEM courses.
- ENG 101 should be treated as writing-heavy if the writing-heavy flag or notes are provided.
- The total weekly time should be approximately 48 hours.
- The overall schedule should usually fall around the moderate range depending on workload flags and notes.

### Qualitative Evaluation

The MVP output is easy to read because it follows a fixed structure:

1. Total Estimated Weekly Time
2. Individual Class Ratings
3. Overall Schedule Rating
4. Pros
5. Cons

This structure makes the result understandable for students who want a quick answer without reading a long essay. The report gives enough detail to explain the schedule risk, but it avoids overwhelming users with unnecessary calculations.

### Error Analysis

Known cases where the MVP may produce imperfect results include:

- A course prefix may be classified as STEM even if a specific class is not especially technical.
- A course without a STEM prefix may still be difficult because of the professor, assignments, or grading policy.
- Keyword matching can overreact to words like "exam" or "presentation" even if the class is still easy.
- The same course can vary significantly by instructor, session, and modality.
- Student reviews may be biased or based on outdated versions of a class.

## 7. Limitations & Risks

### Limitations

- The MVP does not pull live ASU catalog, professor, seat, or syllabus data.
- The MVP does not verify whether a course exists at ASU.
- The scoring model is rule-based, not trained on historical student workload data.
- Course difficulty is estimated from limited information and should not be treated as a guarantee.
- The 4-hours-per-credit estimate is a simplified rule of thumb and may not fit every course.
- The model does not currently personalize recommendations based on the student’s job hours, commute, prior experience, GPA goals, or extracurricular commitments.

### Biases and Data Issues

- Student comments may overrepresent extreme positive or negative experiences.
- Workload can vary by instructor, semester, course redesign, and campus format.
- STEM prefix detection may reflect general assumptions about subject difficulty.
- Keyword-based scoring can miss context, sarcasm, or nuanced syllabus language.

### Privacy Concerns

The current MVP has a low privacy risk because it runs entirely in the browser and does not send data to a server. However, future versions that add live data lookup, accounts, saved schedules, or AI APIs would need stronger privacy protections, including clear data retention policies and safeguards for student information.

### Product Risks

- Students might rely too heavily on the rating instead of talking with an advisor.
- The emoji scale could oversimplify complex academic decisions.
- Users may expect live ASU data even though the MVP currently uses local rules.
- Inaccurate inputs will produce inaccurate recommendations.

## 8. Next Steps

### Technical Next Steps

With 2-3 more months, the project could be expanded in the following ways:

1. **Add live ASU course lookup**
   - Allow users to enter only a course code and automatically retrieve course title, credits, description, and available sections if a reliable data source or approved API is available.

2. **Improve syllabus and review analysis**
   - Add better natural language processing for syllabus text and student comments.
   - Detect workload categories such as exams, essays, labs, coding projects, discussion posts, and presentations more accurately.

3. **Add schedule comparison mode**
   - Let users create multiple possible schedules and compare weekly time, class difficulty, and overall rating side by side.

4. **Add personalization**
   - Ask optional questions about work hours, commute, preferred learning format, prior experience, and desired difficulty level.
   - Adjust schedule recommendations based on the student’s constraints.

5. **Add testing and validation**
   - Create unit tests for parsing, scoring, rating labels, and report rendering.
   - Test the tool with ASU students and compare predicted workload against their actual experience.

6. **Improve deployment**
   - Host the page on GitHub Pages.
   - Add a clear README with screenshots, usage instructions, and limitations.
   - Keep the project as a single-page MVP unless live lookup requires a small backend.

### Product Next Steps

The most important product improvement would be making the page more hands-off while preserving transparency. Ideally, a student could enter only course codes and receive an accurate report based on official course information, syllabus patterns, and student feedback. The long-term goal is not to replace academic advising, but to give students a faster and clearer way to understand schedule workload before registration.
