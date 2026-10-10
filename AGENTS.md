# Git Commit Best Practices - How to Write Meaningful Commits

The purpose of this document is to gather the best practices for using Git in one convenient location and establish conventions to follow when collaborating with others.

---

## 1. Commit Message Norms

### 1. Make clean, single-purpose commits (Atomic commits)
A commit should be a wrapper for related changes. For example, fixing two different bugs should produce two separate commits. Keep commits as small and focused as possible because:
- It makes it easier for other developers in the team and reviewers to understand changes, making code reviews more efficient.
- If a commit has to be rolled back completely, it's far easier to do so.
- It helps parse changes using `git log`.

### 2. Commit early, commit often
Work in smaller portions and frequently commit progress instead of striving for perfection. This ensures code remains up-to-date and minimizes merge conflicts, especially on long-lived feature branches.

### 3. Write meaningful commit messages
- **Tense & Case:** Use imperative, present tense: `"change"`, not `"changed"` nor `"changes"` (written in lower case).
- **Body:** Use the body to explain **what** and **why** the change was made (only when necessary).
- **Length limits:** Keep subject line wrapped at **50 characters** and body wrapped at **72 characters**.
- **Blank lines:** Add an empty line between the subject line, body, and footer.
- **Punctuation:** Do not end the subject line with a period (`.`). Remove unnecessary punctuation marks.

---

## 2. Commit Message Format

```text
<type>(<optional scope>): <subject>

<optional body>

<optional footer(s)>
```

### Type Guidelines
- `feat`: new feature for the user (not for a build script)
- `fix`: bug fix for the user (not a fix to a build script)
- `docs`: changes to documentation
- `style`: formatting, missing semi-colons, whitespace (no production code change)
- `refactor`: refactoring production code (e.g., renaming a variable, restructuring functions)
- `perf`: code change that improves performance
- `test`: adding missing tests, refactoring tests (no production code change)
- `build`: build-related changes, package dependencies, build tools (e.g., npm, Vite, pom.xml)
- `chore`: regular maintenance, updating task runners, repo configuration (e.g., `.gitignore`, `.prettierrc`)

---

## 3. Examples

### Commit message with body and footer
```text
fix: prevent racing of requests

Introduce a request id and a reference to the latest request. Dismiss
incoming responses other than from the latest request.

Resolves: #123
```

### Commit message with body and no footer
```text
fix: remove string template from client code

It is incompatible with IE
```

### Commit message with no body and no footer
```text
docs: prepare CHANGELOG for version x.x.x
```
