# Content Guidelines
## Philippine Government HRMS Application

**Version:** 1.0  
**Date:** January 7, 2025  
**Status:** Active

---

## Table of Contents

1. [Introduction](#introduction)
2. [Tone & Voice](#tone--voice)
3. [Writing Principles](#writing-principles)
4. [Labels & Field Names](#labels--field-names)
5. [Error Messages](#error-messages)
6. [Help Text & Tooltips](#help-text--tooltips)
7. [Success Messages](#success-messages)
8. [Button Labels](#button-labels)
9. [Empty States](#empty-states)
10. [Examples](#examples)

---

## Introduction

### Purpose
These guidelines ensure all UI text in the Philippine Government HRMS application is clear, consistent, and user-friendly. Following these guidelines will help users understand the interface without confusion and complete tasks efficiently.

### Scope
These guidelines apply to:
- Form labels and field names
- Error messages
- Help text and tooltips
- Success and confirmation messages
- Button labels
- Empty state messages
- Navigation labels
- Notifications

---

## Tone & Voice

### Government Professional
- **Professional:** Maintain formality appropriate for government systems
- **Respectful:** Use respectful language for all users
- **Authoritative:** Convey confidence and accuracy
- **Helpful:** Guide users to successful outcomes

### User-Friendly
- **Clear:** Use simple, direct language
- **Concise:** Get to the point quickly
- **Actionable:** Tell users what to do next
- **Empathetic:** Acknowledge user needs and concerns

### Examples

**✅ Good:**
> "Your leave request has been submitted. Your supervisor will review it within 2 business days."

**❌ Bad:**
> "Request successfully processed and forwarded to the appropriate authority for evaluation and determination."

---

## Writing Principles

### 1. Use Plain Language

**Avoid government jargon and technical terms.**

**✅ Do:**
- "Submit" instead of "Execute submission protocol"
- "Approve" instead of "Grant authorization"
- "Employee" instead of "Human resource personnel"
- "Leave" instead of "Absence authorization"

**❌ Don't:**
- Use acronyms without explanation
- Use legal or technical jargon
- Use passive voice excessively
- Use unnecessarily complex words

---

### 2. Be Specific

**Provide concrete information, not vague statements.**

**✅ Do:**
- "Enter your employee ID (e.g., EMP-2024-001)"
- "Select a date between January 1 and December 31, 2024"
- "File size must be less than 5 MB"

**❌ Don't:**
- "Enter valid information"
- "Select appropriate date"
- "File too large"

---

### 3. Be Concise

**Use the fewest words necessary to convey meaning.**

**✅ Do:**
- "Required field"
- "Invalid email address"
- "Select at least one option"

**❌ Don't:**
- "This field is required and must be filled out"
- "The email address you entered is not in a valid format"
- "You must select at least one option from the list"

---

### 4. Be Actionable

**Tell users what to do, not just what went wrong.**

**✅ Do:**
- "Enter a valid email address (e.g., juan.delacruz@gov.ph)"
- "Select a future date for your leave request"
- "Upload a PDF or image file (max 5 MB)"

**❌ Don't:**
- "Invalid input"
- "Error"
- "Wrong file type"

---

### 5. Be Consistent

**Use the same terms for the same concepts throughout the application.**

**Consistent Terms:**
- "Employee" (not "staff," "personnel," "worker")
- "Leave" (not "absence," "time off," "vacation")
- "Pass slip" (not "gate pass," "exit permit")
- "Approve" (not "accept," "authorize," "grant")
- "Reject" (not "deny," "decline," "disapprove")

---

## Labels & Field Names

### Guidelines

1. **Use sentence case** (capitalize only the first word)
2. **Be descriptive** but concise
3. **Avoid redundancy** (don't repeat the section name)
4. **Use nouns or noun phrases**
5. **Mark required fields** with an asterisk (*)

### Examples

**✅ Good Labels:**
- Employee ID *
- First name *
- Last name *
- Email address
- Department
- Position
- Date of birth
- Leave type *
- Start date *
- End date *
- Number of days
- Reason for leave *

**❌ Bad Labels:**
- EMPLOYEE ID (all caps)
- Enter Your First Name (instruction, not label)
- Employee Last Name (redundant "Employee")
- E-mail (inconsistent hyphenation)
- Dept. (abbreviation)
- DOB (acronym)

---

## Error Messages

### Guidelines

1. **Be specific** about what went wrong
2. **Be actionable** - tell users how to fix it
3. **Be polite** - don't blame the user
4. **Use plain language** - avoid technical jargon
5. **Provide examples** when helpful

### Format

```
[What went wrong] [How to fix it] [Example if helpful]
```

### Examples

**Form Validation Errors:**

**✅ Good:**
- "Employee ID is required"
- "Email address must be in valid format (e.g., juan.delacruz@gov.ph)"
- "Start date must be before end date"
- "Password must be at least 8 characters"
- "File size must be less than 5 MB"
- "Select at least one leave type"
- "End date cannot be in the past"

**❌ Bad:**
- "Error: Field empty"
- "Invalid input"
- "Wrong format"
- "Error 400: Bad request"
- "Validation failed"

---

**API/System Errors:**

**✅ Good:**
- "Unable to save your request. Please check your internet connection and try again."
- "This employee ID is already in use. Please enter a different ID."
- "Your session has expired. Please log in again."
- "Unable to load data. Please refresh the page or contact support if the problem persists."

**❌ Bad:**
- "Error: 500 Internal Server Error"
- "Database connection failed"
- "Null pointer exception"
- "Request timeout"

---

**Permission Errors:**

**✅ Good:**
- "You don't have permission to access this page. Contact your administrator if you need access."
- "Only supervisors can approve leave requests."
- "You can only edit your own profile."

**❌ Bad:**
- "Access denied"
- "403 Forbidden"
- "Unauthorized"

---

## Help Text & Tooltips

### Guidelines

1. **Provide context** for complex fields
2. **Explain policies** briefly
3. **Give examples** when helpful
4. **Keep it short** (1-2 sentences)
5. **Use plain language**

### Examples

**✅ Good Help Text:**

**Leave Type:**
> "Select the type of leave you're requesting. Vacation leave requires 3 days advance notice. Sick leave requires a medical certificate for absences over 3 days."

**Pass Slip Type:**
> "Official business: Work-related errands. Personal: Personal appointments. Medical: Doctor visits or medical emergencies."

**Certificate Type:**
> "Certificate of Employment: Proof of current employment. Service Record: Complete employment history. Clearance: Required for separation."

**Employee ID:**
> "Your unique employee identifier (e.g., EMP-2024-001). Contact HR if you don't know your ID."

**❌ Bad Help Text:**
- "Enter value" (not helpful)
- "This field is for the leave type as defined in CSC Memorandum Circular No. 41, s. 1998" (too technical)
- "Select from dropdown" (obvious)

---

## Success Messages

### Guidelines

1. **Confirm the action** that was completed
2. **Provide next steps** if applicable
3. **Be encouraging** but professional
4. **Keep it brief**

### Examples

**✅ Good:**
- "Leave request submitted successfully. Your supervisor will review it within 2 business days."
- "Pass slip approved. The employee can now proceed with their request."
- "Certificate generated successfully. You can now print or download it."
- "Employee profile updated successfully."
- "Password changed successfully. Please use your new password to log in."

**❌ Bad:**
- "Success!" (not specific)
- "Operation completed" (vague)
- "Request processed" (what request?)
- "Done" (too casual)

---

## Button Labels

### Guidelines

1. **Use action verbs**
2. **Be specific** about what will happen
3. **Keep it short** (1-3 words)
4. **Use sentence case**

### Examples

**✅ Good Primary Actions:**
- Submit
- Save
- Approve
- Reject
- Generate
- Create
- Update
- Delete
- Export
- Print

**✅ Good Secondary Actions:**
- Cancel
- Back
- Close
- Reset
- Clear filters

**✅ Good Specific Actions:**
- Submit request
- Save changes
- Approve request
- Reject request
- Generate certificate
- Create employee
- Update profile
- Delete record
- Export to Excel
- Print certificate

**❌ Bad:**
- OK (vague)
- Yes/No (for actions)
- Click here (not descriptive)
- Go (where?)
- Do it (what?)

---

## Empty States

### Guidelines

1. **Explain why it's empty**
2. **Provide an action** if applicable
3. **Be encouraging**
4. **Use an appropriate icon**

### Format

```
[Icon]
[Title: Why it's empty]
[Description: What the user can do]
[Action button if applicable]
```

### Examples

**✅ Good:**

**No Leave Requests:**
> **No leave requests yet**  
> You haven't submitted any leave requests. Click "Request Leave" to get started.  
> [Request Leave]

**No Search Results:**
> **No results found**  
> We couldn't find any employees matching your search. Try adjusting your filters or search terms.  
> [Clear Filters]

**No Pending Approvals:**
> **All caught up!**  
> You have no pending approvals at this time.

**No Data:**
> **No records to display**  
> There are no records matching your current filters.

**❌ Bad:**
- "Empty" (not helpful)
- "No data" (too technical)
- "0 results" (not user-friendly)
- "Nothing here" (too casual)

---

## Examples

### Complete Form Example

```vue
<v-form>
  <!-- Good label with required indicator -->
  <v-text-field
    label="Employee ID *"
    hint="Your unique employee identifier (e.g., EMP-2024-001)"
    persistent-hint
    :rules="[
      v => !!v || 'Employee ID is required',
      v => /^EMP-\d{4}-\d{3}$/.test(v) || 'Employee ID must be in format EMP-YYYY-NNN'
    ]"
  />
  
  <!-- Good help tooltip -->
  <v-select
    label="Leave type *"
    :items="leaveTypes"
    :rules="[v => !!v || 'Leave type is required']"
  >
    <template #append>
      <HelpTooltip>
        Select the type of leave you're requesting. Vacation leave requires 3 days advance notice.
      </HelpTooltip>
    </template>
  </v-select>
  
  <!-- Good date validation -->
  <v-text-field
    label="Start date *"
    type="date"
    :rules="[
      v => !!v || 'Start date is required',
      v => new Date(v) >= new Date() || 'Start date must be today or in the future'
    ]"
  />
  
  <!-- Good action buttons -->
  <v-card-actions>
    <v-spacer />
    <v-btn variant="text" @click="cancel">Cancel</v-btn>
    <v-btn color="primary" @click="submit">Submit request</v-btn>
  </v-card-actions>
</v-form>
```

### Complete Error Handling Example

```javascript
try {
  await submitLeaveRequest(formData)
  // Good success message
  showSuccess('Leave request submitted successfully. Your supervisor will review it within 2 business days.')
  router.push('/leave')
} catch (error) {
  // Good error messages based on error type
  if (error.response?.status === 400) {
    showError('Unable to submit request. Please check all required fields and try again.')
  } else if (error.response?.status === 401) {
    showError('Your session has expired. Please log in again.')
    router.push('/login')
  } else if (error.response?.status === 403) {
    showError('You don\'t have permission to submit leave requests. Contact your administrator.')
  } else if (error.response?.status === 409) {
    showError('You already have a leave request for these dates. Please select different dates.')
  } else {
    showError('Unable to submit request. Please check your internet connection and try again.')
  }
}
```

---

## Content Review Checklist

Use this checklist when writing or reviewing UI content:

**Clarity:**
- [ ] Uses plain language (no jargon)
- [ ] Is specific and concrete
- [ ] Provides examples when helpful
- [ ] Is easy to understand

**Conciseness:**
- [ ] Uses fewest words necessary
- [ ] Removes redundant information
- [ ] Gets to the point quickly

**Actionability:**
- [ ] Tells users what to do
- [ ] Provides clear next steps
- [ ] Includes examples when needed

**Consistency:**
- [ ] Uses consistent terminology
- [ ] Follows established patterns
- [ ] Matches tone and voice guidelines

**Accessibility:**
- [ ] Works with screen readers
- [ ] Provides sufficient context
- [ ] Uses proper heading hierarchy

**Professionalism:**
- [ ] Appropriate for government system
- [ ] Respectful and courteous
- [ ] Authoritative but helpful

---

## References

- [Plain Language Guidelines (plainlanguage.gov)](https://www.plainlanguage.gov/)
- [Material Design Writing Guidelines](https://material.io/design/communication/writing.html)
- [Nielsen Norman Group: Error Message Guidelines](https://www.nngroup.com/articles/error-message-guidelines/)
- [Mailchimp Content Style Guide](https://styleguide.mailchimp.com/)

---

**Document End**

*These guidelines should be followed for all new content and used to audit existing content.*

