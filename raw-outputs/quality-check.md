# Quality check

## Expected behavior
- Each case identifies a narrow issue and a forum only at a general level.
- Each notice includes amount, date, deadline, and preservation language where relevant.
- No unsupported statute, case citation, or guaranteed outcome is generated.
- The user is reminded to seek a licensed lawyer for filing or deadlines.

## Bad cases observed
- `TC-04`: If no amount is entered, the UI blocks continuation and does not invent a value.
- `TC-05`: A criminal, property, family, or tax problem has no covered category. The current prototype routes only to the three supported flows; it should disclose lack of coverage instead of guessing.
- `TC-06`: The payment deadline is 7–15 days as a reasonable starter, not a statement of legal entitlement.

## Limitation
The prototype's drafting is template-based rather than model-generated. This is intentional for this assignment: it avoids invented laws, while a production version can use the same case schema with retrieved, reviewed sources.
