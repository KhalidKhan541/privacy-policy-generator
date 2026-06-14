document.addEventListener('DOMContentLoaded', () => {
  let currentStep = 1;
  const totalSteps = 5;

  const form = document.getElementById('policyForm');
  const steps = document.querySelectorAll('.wizard-step');
  const progressSteps = document.querySelectorAll('.progress-step');
  const policyOutput = document.getElementById('policyOutput');
  const embedContainer = document.getElementById('embedContainer');
  const embedCode = document.getElementById('embedCode');
  const toast = document.getElementById('toast');

  // Template selection
  document.querySelectorAll('.template-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.template-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
    });
  });

  // Other services toggle
  document.querySelector('input[value="other"]').addEventListener('change', (e) => {
    document.getElementById('otherServicesGroup').style.display = e.target.checked ? 'block' : 'none';
  });

  // Navigation
  document.querySelectorAll('.next-step').forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep === 4) {
        generatePolicy();
      }
      if (currentStep < totalSteps) {
        goToStep(currentStep + 1);
      }
    });
  });

  document.querySelectorAll('.prev-step').forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep > 1) goToStep(currentStep - 1);
    });
  });

  function goToStep(step) {
    steps.forEach(s => s.classList.remove('active'));
    progressSteps.forEach((s, i) => {
      s.classList.remove('active', 'completed');
      if (i + 1 < step) s.classList.add('completed');
      if (i + 1 === step) s.classList.add('active');
    });
    document.querySelector(`.wizard-step[data-step="${step}"]`).classList.add('active');
    currentStep = step;
    embedContainer.style.display = 'none';
  }

  function getFormData() {
    const dataTypes = [...document.querySelectorAll('input[name="dataTypes"]:checked')].map(c => c.value);
    const services = [...document.querySelectorAll('input[name="services"]:checked')].map(c => c.value);
    const otherServices = document.getElementById('otherServices').value;
    if (otherServices && services.includes('other')) {
      otherServices.split(',').forEach(s => services.push(s.trim()));
    }
    return {
      template: document.querySelector('input[name="template"]:checked').value,
      businessName: document.getElementById('businessName').value || 'Your Business',
      websiteUrl: document.getElementById('websiteUrl').value || 'https://example.com',
      contactEmail: document.getElementById('contactEmail').value || 'privacy@example.com',
      businessAddress: document.getElementById('businessAddress').value,
      dataTypes,
      services,
      gdpr: document.querySelector('input[name="gdpr"]').checked,
      ccpa: document.querySelector('input[name="ccpa"]').checked,
    };
  }

  function dataTypeLabel(type) {
    const labels = {
      personal_info: 'Personal Information (such as name, email address, and other identifying information)',
      cookies: 'Cookies and similar tracking technologies',
      analytics: 'Analytics and usage data (such as pages visited, time spent on pages)',
      payment: 'Payment information (processed securely through third-party payment processors)',
      location: 'Location data (such as IP-based geolocation)',
      usage: 'Usage data (such as features used, preferences, and settings)',
      device: 'Device information (such as browser type, operating system, device identifiers)',
      social: 'Social media profile information (when you choose to connect your social accounts)',
    };
    return labels[type] || type;
  }

  function serviceName(svc) {
    const names = {
      google_analytics: 'Google Analytics',
      google_adsense: 'Google AdSense',
      stripe: 'Stripe',
      paypal: 'PayPal',
      facebook_pixel: 'Facebook Pixel',
      mailchimp: 'Mailchimp',
      cloudflare: 'Cloudflare',
    };
    return names[svc] || svc;
  }

  function generatePolicy() {
    const d = getFormData();
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const templateSpecific = {
      blog: `<h2>Comments and User Content</h2>
<p>When visitors leave comments or submit content on ${d.businessName}, we collect the data shown in the comment form, and also the visitor's IP address and browser user agent string to help spam detection.</p>`,
      ecommerce: `<h2>Payments</h2>
<p>All payment processing is handled securely by our third-party payment processors (${d.services.includes('stripe') ? 'Stripe' : d.services.includes('paypal') ? 'PayPal' : 'our payment providers'}). We do not store your full credit card number on our servers. Financial transactions are processed in compliance with PCI-DSS standards.</p>
<h2>Order Information</h2>
<p>We collect information related to your orders including products purchased, purchase date, shipping address, and order status to fulfill and track your purchases.</p>`,
      saas: `<h2>Account Registration</h2>
<p>To use ${d.businessName}, you may need to create an account. We collect your name, email address, and password (stored in hashed form) to manage your account and provide customer support.</p>
<h2>Service Usage</h2>
<p>We collect data about how you interact with our service, including features used, settings configured, and performance metrics, to improve and optimize the platform.</p>`,
      mobile: `<h2>App Permissions</h2>
<p>${d.businessName} may request access to the following device features:</p>
<ul>
<li>Camera (for profile photos or scanning features)</li>
<li>Storage (for saving data locally)</li>
<li>Notifications (for service updates and alerts)</li>
</ul>
<p>You can manage permissions through your device settings at any time.</p>
<h2>App Analytics</h2>
<p>We use analytics tools to understand how our app is used, including crash reports, feature usage, and performance data.</p>`,
    };

    const gdprSection = d.gdpr ? `<h2>Your Rights Under GDPR</h2>
<p>If you are located in the European Economic Area (EEA), you have the following rights under the General Data Protection Regulation (GDPR):</p>
<ul>
<li><strong>Right of Access</strong> – You have the right to request a copy of the personal data we hold about you.</li>
<li><strong>Right to Rectification</strong> – You have the right to request correction of inaccurate personal data.</li>
<li><strong>Right to Erasure</strong> – You have the right to request deletion of your personal data ("right to be forgotten").</li>
<li><strong>Right to Restrict Processing</strong> – You have the right to request restriction of processing of your personal data.</li>
<li><strong>Right to Data Portability</strong> – You have the right to receive your personal data in a structured, machine-readable format.</li>
<li><strong>Right to Object</strong> – You have the right to object to processing of your personal data.</li>
<li><strong>Right to Withdraw Consent</strong> – Where processing is based on consent, you have the right to withdraw consent at any time.</li>
</ul>
<p>To exercise any of these rights, please contact us at <a href="mailto:${d.contactEmail}">${d.contactEmail}</a>.</p>
<p>We will respond to your request within 30 days. If you are not satisfied with our response, you have the right to lodge a complaint with a supervisory authority.</p>` : '';

    const ccpaSection = d.ccpa ? `<h2>Your Rights Under CCPA</h2>
<p>If you are a California resident, the California Consumer Privacy Act (CCPA) grants you the following rights:</p>
<ul>
<li><strong>Right to Know</strong> – You have the right to know what personal information we collect, use, disclose, and sell.</li>
<li><strong>Right to Delete</strong> – You have the right to request deletion of your personal information.</li>
<li><strong>Right to Opt-Out of Sale</strong> – We do not sell your personal information. If this changes, we will provide an opt-out mechanism.</li>
<li><strong>Right to Non-Discrimination</strong> – We will not discriminate against you for exercising your CCPA rights.</li>
</ul>
<p>To exercise your rights under the CCPA, please contact us at <a href="mailto:${d.contactEmail}">${d.contactEmail}</a>. We will verify your identity before processing your request.</p>` : '';

    const servicesSection = d.services.length > 0 ? `<h2>Third-Party Services</h2>
<p>We use the following third-party services that may collect information:</p>
<ul>${d.services.map(s => `<li><strong>${serviceName(s)}</strong> – Used for ${s === 'google_analytics' ? 'website analytics and traffic measurement' : s === 'google_adsense' ? 'serving advertisements' : s === 'stripe' || s === 'paypal' ? 'payment processing' : s === 'facebook_pixel' ? 'advertising and conversion tracking' : s === 'mailchimp' ? 'email marketing and newsletters' : s === 'cloudflare' ? 'content delivery and security' : 'service functionality'}.</li>`).join('\n')}</ul>
<p>These third-party services have their own privacy policies governing the use of your information.</p>` : '';

    const html = `<h1>Privacy Policy</h1>
<p class="last-updated">Last updated: ${today}</p>
<p>${d.businessName} ("${d.businessName}", "we", "us", or "our") operates the ${d.websiteUrl} website${d.template === 'mobile' ? ' and mobile application' : ''} (the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal information when you use our Service.</p>
<p>By using the Service, you agree to the collection and use of information in accordance with this policy.</p>

<h2>Information We Collect</h2>
<p>We collect several types of information for various purposes to provide and improve our Service to you:</p>
<h3>Personal Data</h3>
<p>While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). We collect:</p>
<ul>${d.dataTypes.map(t => `<li>${dataTypeLabel(t)}</li>`).join('\n')}</ul>

<h2>How We Use Your Information</h2>
<p>We use the collected information for the following purposes:</p>
<ul>
<li>To provide and maintain our Service</li>
<li>To notify you about changes to our Service</li>
<li>To allow you to participate in interactive features</li>
<li>To provide customer support</li>
<li>To gather analysis so that we can improve our Service</li>
<li>To monitor the usage of our Service</li>
<li>To detect, prevent, and address technical issues</li>
<li>To send you promotional communications (with your consent)</li>
</ul>

<h2>Data Retention</h2>
<p>We retain your Personal Data only for as long as necessary for the purposes outlined in this Privacy Policy. We will retain and use your data to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our policies.</p>

<h2>Data Security</h2>
<p>The security of your data is important to us. We strive to use commercially acceptable means of protecting your Personal Information, but no method of transmission over the Internet or method of electronic storage is 100% secure.</p>

<h2>Cookies</h2>
<p>We use cookies and similar tracking technologies to track activity on our Service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.</p>

${servicesSection}
${templateSpecific[d.template] || ''}
${gdprSection}
${ccpaSection}

<h2>Changes to This Privacy Policy</h2>
<p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top of this policy.</p>
<p>We encourage you to review this Privacy Policy periodically for any changes.</p>

<h2>Contact Us</h2>
<p>If you have any questions about this Privacy Policy, please contact us:</p>
<ul>
<li>By email: <a href="mailto:${d.contactEmail}">${d.contactEmail}</a></li>
<li>By visiting: ${d.websiteUrl}${d.businessAddress ? `<br>Address: ${d.businessAddress}` : ''}</li>
</ul>`;

    policyOutput.innerHTML = html;

    const embedHtml = `<iframe src="${d.websiteUrl}/privacy-policy" width="100%" height="800" frameborder="0" title="Privacy Policy"></iframe>`;
    embedCode.textContent = embedHtml;
  }

  // Copy to clipboard
  document.getElementById('copyBtn').addEventListener('click', () => {
    const text = policyOutput.innerText;
    navigator.clipboard.writeText(text).then(() => showToast('Copied to clipboard!'));
  });

  // Download PDF
  document.getElementById('downloadBtn').addEventListener('click', () => {
    const opt = {
      margin: [0.5, 0.5],
      filename: 'privacy-policy.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    };
    html2pdf().set(opt).from(policyOutput).save();
  });

  // Preview toggle
  document.getElementById('previewToggle').addEventListener('click', () => {
    policyOutput.classList.toggle('preview-mode');
    const btn = document.getElementById('previewToggle');
    btn.textContent = policyOutput.classList.contains('preview-mode') ? 'Edit View' : 'Preview';
  });

  // Embed code
  document.getElementById('embedBtn').addEventListener('click', () => {
    embedContainer.style.display = embedContainer.style.display === 'none' ? 'block' : 'none';
  });

  document.getElementById('copyEmbedBtn').addEventListener('click', () => {
    navigator.clipboard.writeText(embedCode.textContent).then(() => showToast('Embed code copied!'));
  });

  // New policy
  document.getElementById('newPolicyBtn').addEventListener('click', () => {
    form.reset();
    document.querySelectorAll('.template-card').forEach(c => c.classList.remove('selected'));
    document.querySelector('.template-card').classList.add('selected');
    document.getElementById('otherServicesGroup').style.display = 'none';
    goToStep(1);
  });

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
  }
});
