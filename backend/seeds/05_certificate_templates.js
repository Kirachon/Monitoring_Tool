/**
 * Seed Certificate Templates
 * Pre-populates system with standard Philippine government certificate templates
 */

exports.seed = async function(knex) {
  // Get any user (first user in the system)
  const anyUser = await knex('users')
    .select('id')
    .first();

  const createdBy = anyUser ? anyUser.id : null;

  // Delete existing templates
  await knex('certificate_templates').del();

  // Build template objects
  const buildTemplate = (name, type, content, placeholders) => {
    const template = {
      name,
      certificate_type: type,
      template_content: content,
      placeholders: JSON.stringify(placeholders),
      is_active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    };
    if (createdBy) {
      template.created_by = createdBy;
    }
    return template;
  };

  // Insert default templates
  await knex('certificate_templates').insert([
    buildTemplate(
      'Certificate of Employment',
      'Employment',
      `<div style="font-family: Arial, sans-serif; padding: 40px;">
<div style="text-align: center; margin-bottom: 30px;">
<h2>REPUBLIC OF THE PHILIPPINES</h2>
<h3>{{department}}</h3>
<h4>CERTIFICATE OF EMPLOYMENT</h4>
</div>

<p style="text-align: justify; line-height: 1.8;">
TO WHOM IT MAY CONCERN:
</p>

<p style="text-align: justify; line-height: 1.8; text-indent: 50px;">
This is to certify that <strong>{{employee_name}}</strong>, Employee ID: <strong>{{employee_id}}</strong>, is currently employed in this office as <strong>{{position}}</strong> with Salary Grade <strong>{{salary_grade}}</strong>, effective <strong>{{date_hired}}</strong> to present.
</p>

<p style="text-align: justify; line-height: 1.8; text-indent: 50px;">
This certification is being issued upon the request of the above-named employee for whatever legal purpose it may serve.
</p>

<p style="text-align: justify; line-height: 1.8; text-indent: 50px;">
Issued this <strong>{{current_date}}</strong>.
</p>

<div style="margin-top: 60px;">
<p><strong>{{signatory_name}}</strong><br>
{{signatory_title}}</p>
</div>
</div>`,
      ['employee_name', 'employee_id', 'position', 'department', 'date_hired', 'salary_grade', 'current_date', 'signatory_name', 'signatory_title']
    ),
    buildTemplate(
      'Certificate of Clearance',
      'Clearance',
      `<div style="font-family: Arial, sans-serif; padding: 40px;">
<div style="text-align: center; margin-bottom: 30px;">
<h2>REPUBLIC OF THE PHILIPPINES</h2>
<h3>{{department}}</h3>
<h4>CERTIFICATE OF CLEARANCE</h4>
</div>

<p style="text-align: justify; line-height: 1.8;">
TO WHOM IT MAY CONCERN:
</p>

<p style="text-align: justify; line-height: 1.8; text-indent: 50px;">
This is to certify that <strong>{{employee_name}}</strong>, Employee ID: <strong>{{employee_id}}</strong>, has no pending accountabilities and obligations with this office as of <strong>{{current_date}}</strong>.
</p>

<p style="text-align: justify; line-height: 1.8; text-indent: 50px;">
This certification is being issued for whatever legal purpose it may serve.
</p>

<div style="margin-top: 60px;">
<p><strong>{{signatory_name}}</strong><br>
{{signatory_title}}</p>
</div>
</div>`,
      ['employee_name', 'employee_id', 'department', 'current_date', 'signatory_name', 'signatory_title']
    ),
    buildTemplate(
      'Certificate of Leave Credits',
      'Leave',
      `<div style="font-family: Arial, sans-serif; padding: 40px;">
<div style="text-align: center; margin-bottom: 30px;">
<h2>REPUBLIC OF THE PHILIPPINES</h2>
<h3>{{department}}</h3>
<h4>CERTIFICATE OF LEAVE CREDITS</h4>
</div>

<p style="text-align: justify; line-height: 1.8;">
TO WHOM IT MAY CONCERN:
</p>

<p style="text-align: justify; line-height: 1.8; text-indent: 50px;">
This is to certify that <strong>{{employee_name}}</strong>, Employee ID: <strong>{{employee_id}}</strong>, currently holds the position of <strong>{{position}}</strong> in this office.
</p>

<p style="text-align: justify; line-height: 1.8; text-indent: 50px;">
As of <strong>{{current_date}}</strong>, the employee has the following leave credits:
</p>

<table style="margin: 20px auto; border-collapse: collapse; width: 60%;">
<tr style="border-bottom: 1px solid #000;">
<td style="padding: 10px;"><strong>Vacation Leave:</strong></td>
<td style="padding: 10px; text-align: right;"><strong>{{vl_balance}} days</strong></td>
</tr>
<tr style="border-bottom: 1px solid #000;">
<td style="padding: 10px;"><strong>Sick Leave:</strong></td>
<td style="padding: 10px; text-align: right;"><strong>{{sl_balance}} days</strong></td>
</tr>
</table>

<p style="text-align: justify; line-height: 1.8; text-indent: 50px;">
This certification is being issued upon the request of the above-named employee for whatever legal purpose it may serve.
</p>

<div style="margin-top: 60px;">
<p><strong>{{signatory_name}}</strong><br>
{{signatory_title}}</p>
</div>
</div>`,
      ['employee_name', 'employee_id', 'position', 'department', 'vl_balance', 'sl_balance', 'current_date', 'signatory_name', 'signatory_title']
    ),
    buildTemplate(
      'Service Record',
      'Service',
      `<div style="font-family: Arial, sans-serif; padding: 40px;">
<div style="text-align: center; margin-bottom: 30px;">
<h2>REPUBLIC OF THE PHILIPPINES</h2>
<h3>{{department}}</h3>
<h4>SERVICE RECORD</h4>
</div>

<p style="line-height: 1.8;">
<strong>Name:</strong> {{employee_name}}<br>
<strong>Employee ID:</strong> {{employee_id}}<br>
<strong>Position:</strong> {{position}}<br>
<strong>Date Hired:</strong> {{date_hired}}<br>
<strong>Salary Grade:</strong> {{salary_grade}}
</p>

<p style="text-align: justify; line-height: 1.8; margin-top: 30px;">
This is to certify that the above information is true and correct based on the records of this office.
</p>

<p style="text-align: justify; line-height: 1.8; text-indent: 50px;">
Issued this <strong>{{current_date}}</strong>.
</p>

<div style="margin-top: 60px;">
<p><strong>{{signatory_name}}</strong><br>
{{signatory_title}}</p>
</div>
</div>`,
      ['employee_name', 'employee_id', 'position', 'department', 'date_hired', 'salary_grade', 'current_date', 'signatory_name', 'signatory_title']
    ),
    buildTemplate(
      'Certificate of No Pending Case',
      'Clearance',
      `<div style="font-family: Arial, sans-serif; padding: 40px;">
<div style="text-align: center; margin-bottom: 30px;">
<h2>REPUBLIC OF THE PHILIPPINES</h2>
<h3>{{department}}</h3>
<h4>CERTIFICATE OF NO PENDING CASE</h4>
</div>

<p style="text-align: justify; line-height: 1.8;">
TO WHOM IT MAY CONCERN:
</p>

<p style="text-align: justify; line-height: 1.8; text-indent: 50px;">
This is to certify that <strong>{{employee_name}}</strong>, Employee ID: <strong>{{employee_id}}</strong>, has no pending administrative or criminal case filed against him/her in this office as of <strong>{{current_date}}</strong>.
</p>

<p style="text-align: justify; line-height: 1.8; text-indent: 50px;">
This certification is being issued upon the request of the above-named employee for whatever legal purpose it may serve.
</p>

<div style="margin-top: 60px;">
<p><strong>{{signatory_name}}</strong><br>
{{signatory_title}}</p>
</div>
</div>`,
      ['employee_name', 'employee_id', 'department', 'current_date', 'signatory_name', 'signatory_title']
    )
  ]);

  console.log('✅ Certificate templates seeded successfully');
};

