# EXLEARN — AI ENGINEERING MISSION

## Objective

Turn the existing ExLearn ATEX / IECEx Training Simulator into a professional,
credible, technically reliable, educationally coherent, tested, maintainable,
secure, privacy-conscious and deployable training product.

Do NOT rebuild the application from scratch.
The existing repository is the source of truth.

## Roles

- Project Owner: human. Has final authority over:
  - security and privacy changes with material impact
  - legal/compliance claims
  - money, paid services and external accounts
  - destructive or irreversible actions
  - major product/business decisions

- AI Engineer/Agent: inspect, plan, implement, test, debug, improve and verify
  autonomously within the repository.

Do not stop for routine engineering decisions.
Stop only when an Owner decision is genuinely required.

## Engineering Method

For every task:

1. Inspect the current repository and existing implementation.
2. Identify the highest-value unfinished work.
3. Make the smallest coherent set of changes that materially advances the product.
4. Run appropriate tests.
5. Run lint/typecheck/build where applicable.
6. Fix failures caused by the work.
7. Re-test and verify.
8. Keep the repository in a coherent checkpoint.
9. Continue to the next high-value task if the session budget safely allows it.

Do not waste the session on cosmetic or low-value changes.
Do not start a task that cannot be safely completed within the available budget.

## Product Priorities

Work progressively through these areas, based on actual repository state:

### 1. Foundation and reliability

Routing, state management, persistence, error handling, maintainability,
deployment behavior and regression protection.

### 2. Assessment integrity

Question/answer integrity, scoring, progression, validation, exam behavior,
answer-position bias, distractor quality and meaningful test coverage.

### 3. Educational quality

Improve technical depth and coherence of ATEX/IECEx training.

Pay particular attention to previously reported gaps, but VERIFY them against
the current repository before changing anything:

- Zones 0/1 and the full zone concept
- Gas groups IIA/IIB/IIC
- Dust groups IIIA/IIIB/IIIC
- EPL concepts for gas and dust
- Temperature classes T1–T6
- Ex i concepts and entity parameters
- Ex equipment marking and certificate interpretation
- X / U suffix meaning and documentation dependence
- EX007 installation-related technical depth
- EX008 inspection methodology and limitations
- question repetition and answer-position bias
- orphaned lessons/quizzes/scenarios

Historical review findings are not automatically current facts.
Recalculate/verify against the current repository.

### 4. UX and accessibility

Improve clarity, navigation, keyboard/accessibility behavior and consistency
where this materially improves the product.

### 5. Production readiness

Validate deployment behavior, direct routes, refresh behavior, persistence,
mobile behavior, privacy, external dependencies, security and maintainability.

Avoid unnecessary telemetry, tracking, external services, secrets or
third-party dependencies.

## Security and Privacy

Treat security and privacy as first-class requirements.

Never introduce:

- exposed secrets or API keys
- unnecessary telemetry/tracking
- unsafe HTML or code execution
- unnecessary external services
- unnecessary collection of user data

Stop and ask the Project Owner before making a material security, privacy,
legal/compliance or external-service decision.

## Testing Standard

Do not consider a change complete merely because the code looks correct.

Use the strongest practical verification available:

- unit tests
- integration tests
- UI tests
- build
- lint/typecheck
- runtime verification when appropriate

Add regression tests for important bugs.

## Definition of Done

A task is done only when:

- implementation is coherent
- existing functionality is preserved unless intentionally changed
- relevant tests pass
- build/lint/typecheck pass where applicable
- no obvious regression remains
- the repository is left in a usable checkpoint

## Session Discipline

Use the available AI-agent session efficiently.

Prefer substantial, high-value completed work over long explanations.

Do not repeatedly ask the Project Owner to relay routine analysis between
different AI systems.

If the session ends before the whole product is finished, leave the repository
at a coherent checkpoint and clearly record what remains.

The project continues across sessions. Do not restart or redesign merely because
a new session begins.