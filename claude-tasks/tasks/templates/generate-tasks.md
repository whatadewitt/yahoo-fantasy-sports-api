# Task List Generator

You will create a detailed implementation task list from the provided PRD.

## Input
Reference the PRD file: `claude-tasks/docs/[feature-name]-prd.md`

## Process

1. **Analyze the PRD** thoroughly to understand all requirements
2. **Generate Parent Tasks** - High-level implementation phases
3. **Break Down Sub-Tasks** - Granular, actionable steps for each parent task
4. **Organize for Visibility** - Ensure each completed task produces observable results

## Task Organization Rules

- Each parent task should produce a visible, testable outcome
- Sub-tasks should be completable in 30-60 minutes
- Include relevant files that need creation/modification
- Add test requirements for each task
- Order tasks to minimize dependencies

## Output Format

```markdown
# Implementation Tasks for [Feature Name]

## Parent Task 1: [Name]
**Goal**: [What this accomplishes]
**Outcome**: [What will be visible/testable]

### Sub-tasks:
- [ ] Sub-task 1.1: [Specific action]
- [ ] Sub-task 1.2: [Specific action]
- [ ] Test: [How to verify this parent task works]

**Files to modify/create**:
- `path/to/file1.js`
- `path/to/test1.spec.js`

## Parent Task 2: [Name]
[Continue pattern...]