const step1Output = steps.code.data;
let form = step1Output.form;

// Replace undefined with null
Object.keys(form).forEach(k => { if (form[k] === undefined) form[k] = null; });

// Wrap in array for SQL
return JSON.stringify([form]);
