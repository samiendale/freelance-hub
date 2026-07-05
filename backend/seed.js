const { User, Category, Job, Application, Contract, Review } = require('./src/models');
const { hashPassword } = require('./src/utils/hash');
const sequelize = require('./src/config/db');

async function seed() {
  try {
    console.log('--- Seeding database ---');

    await sequelize.authenticate();
    console.log('Database connected.');

    await sequelize.sync({ force: true });
    console.log('Tables created.');

    // ── Users ──
    const pwd = await hashPassword('password123');
    const adminPwd = await hashPassword('admin123');

    const users = await User.bulkCreate([
      { name: 'Admin User', email: 'admin@example.com', password_hash: adminPwd, role: 'admin', bio: 'Platform administrator.' },
      { name: 'Sarah Johnson', email: 'sarah@techcorp.com', password_hash: pwd, role: 'employer', bio: 'CTO at TechCorp.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah' },
      { name: 'Mike Chen', email: 'mike@startup.io', password_hash: pwd, role: 'employer', bio: 'Founder of a fintech startup.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike' },
      { name: 'Emily Davis', email: 'emily@designlab.com', password_hash: pwd, role: 'employer', bio: 'Creative director at DesignLab.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emily' },
      { name: 'James Wilson', email: 'james@webagency.com', password_hash: pwd, role: 'employer', bio: 'Owner of a digital agency.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=james' },
      { name: 'Alex Rivera', email: 'alex@email.com', password_hash: pwd, role: 'freelancer', bio: 'Full-stack developer with 6 years of experience.', skills: ['React', 'Node.js', 'Python', 'PostgreSQL', 'TypeScript'], avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex' },
      { name: 'Jessica Kim', email: 'jessica@email.com', password_hash: pwd, role: 'freelancer', bio: 'UI/UX designer specializing in web and mobile apps.', skills: ['Figma', 'UI Design', 'UX Research', 'Prototyping', 'Design Systems'], avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jessica' },
      { name: 'David Patel', email: 'david@email.com', password_hash: pwd, role: 'freelancer', bio: 'Mobile developer (React Native, Flutter).', skills: ['React Native', 'Flutter', 'iOS', 'Android', 'Dart'], avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david' },
      { name: 'Maria Garcia', email: 'maria@email.com', password_hash: pwd, role: 'freelancer', bio: 'Data scientist and ML engineer.', skills: ['Python', 'TensorFlow', 'PyTorch', 'SQL', 'R'], avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria' },
      { name: 'Tom Baker', email: 'tom@email.com', password_hash: pwd, role: 'freelancer', bio: 'DevOps engineer and cloud architect.', skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD'], avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tom' },
      { name: 'Sophie Williams', email: 'sophie@email.com', password_hash: pwd, role: 'freelancer', bio: 'Content writer and SEO specialist.', skills: ['Copywriting', 'SEO', 'Content Strategy', 'Blogging', 'Technical Writing'], avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sophie' },
      { name: 'Liam Brown', email: 'liam@email.com', password_hash: pwd, role: 'freelancer', bio: 'Digital marketing expert.', skills: ['Digital Marketing', 'SEO', 'PPC', 'Social Media', 'Analytics'], avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=liam' },
    ]);
    console.log(`Created ${users.length} users.`);

    // ── Categories ──
    const categories = await Category.bulkCreate([
      { name: 'Web Development', slug: 'web-development', description: 'Building websites and web applications' },
      { name: 'Mobile Development', slug: 'mobile-development', description: 'Building mobile apps for iOS and Android' },
      { name: 'Graphic Design', slug: 'graphic-design', description: 'Visual design, logos, and branding' },
      { name: 'Writing & Content', slug: 'writing-content', description: 'Content writing, copywriting, and editing' },
      { name: 'Data Science', slug: 'data-science', description: 'Data analysis, ML, and AI' },
      { name: 'DevOps & Cloud', slug: 'devops-cloud', description: 'Infrastructure, CI/CD, and cloud services' },
      { name: 'Marketing', slug: 'marketing', description: 'Digital marketing, SEO, and social media' },
    ]);
    console.log(`Created ${categories.length} categories.`);

    // Map by slug
    const cat = {};
    categories.forEach(c => { cat[c.slug] = c.id; });

    const emp = { sarah: 2, mike: 3, emily: 4, james: 5 };
    const free = { alex: 6, jessica: 7, david: 8, maria: 9, tom: 10, sophie: 11, liam: 12 };

    // ── Jobs ──
    const jobs = await Job.bulkCreate([
      { employer_id: emp.sarah, category_id: cat['web-development'], title: 'E-commerce Platform Redesign', description: 'We need a complete redesign of our e-commerce platform. Must be responsive, fast, and accessible. Tech stack: React, Node.js, PostgreSQL.', budget_min: 15000, budget_max: 25000, deadline: '2026-09-15', status: 'open' },
      { employer_id: emp.sarah, category_id: cat['data-science'], title: 'Customer Churn Prediction Model', description: 'Build an ML model to predict customer churn. We have historical data available.', budget_min: 8000, budget_max: 12000, deadline: '2026-08-01', status: 'open' },
      { employer_id: emp.mike, category_id: cat['mobile-development'], title: 'Fintech Mobile App Development', description: 'Build a cross-platform fintech app for budgeting and expense tracking.', budget_min: 20000, budget_max: 35000, deadline: '2026-10-01', status: 'open' },
      { employer_id: emp.mike, category_id: cat['devops-cloud'], title: 'AWS Infrastructure Setup', description: 'Set up a scalable AWS infrastructure for our SaaS product.', budget_min: 10000, budget_max: 18000, deadline: '2026-07-20', status: 'open' },
      { employer_id: emp.emily, category_id: cat['graphic-design'], title: 'Brand Identity Design', description: 'We need a complete brand identity package including logo, color palette, and brand guidelines.', budget_min: 5000, budget_max: 8000, deadline: '2026-08-15', status: 'open' },
      { employer_id: emp.emily, category_id: cat['web-development'], title: 'Portfolio Website for Design Studio', description: 'Build a stunning portfolio website for our design studio.', budget_min: 6000, budget_max: 10000, deadline: '2026-09-01', status: 'open' },
      { employer_id: emp.james, category_id: cat['web-development'], title: 'SaaS Dashboard Frontend', description: 'Build a modern admin dashboard for our SaaS product.', budget_min: 12000, budget_max: 18000, deadline: '2026-08-30', status: 'open' },
      { employer_id: emp.james, category_id: cat['writing-content'], title: 'Technical Documentation Writer', description: 'Write comprehensive API documentation and developer guides.', budget_min: 4000, budget_max: 6000, deadline: '2026-07-25', status: 'open' },
      { employer_id: emp.sarah, category_id: cat['mobile-development'], title: 'iOS App Bug Fixes & Features', description: 'Fix existing bugs and add new features to our iOS app.', budget_min: 7000, budget_max: 11000, deadline: '2026-08-10', status: 'in_progress' },
      { employer_id: emp.mike, category_id: cat['web-development'], title: 'API Gateway Microservice', description: 'Build an API gateway for our microservices architecture.', budget_min: 9000, budget_max: 15000, deadline: '2026-07-30', status: 'open' },
      { employer_id: emp.emily, category_id: cat['marketing'], title: 'Social Media Campaign Design', description: 'Design visuals for a 3-month social media campaign.', budget_min: 3000, budget_max: 5000, deadline: '2026-08-20', status: 'open' },
      { employer_id: emp.james, category_id: cat['graphic-design'], title: 'Mobile App UI Kit', description: 'Create a comprehensive UI kit for our mobile app in Figma.', budget_min: 4000, budget_max: 7000, deadline: '2026-09-10', status: 'open' },
      { employer_id: emp.sarah, category_id: cat['devops-cloud'], title: 'Kubernetes Migration', description: 'Migrate our Docker Compose setup to Kubernetes.', budget_min: 15000, budget_max: 22000, deadline: '2026-09-30', status: 'open' },
      { employer_id: emp.mike, category_id: cat['data-science'], title: 'Real-time Fraud Detection System', description: 'Build a real-time fraud detection system using streaming data.', budget_min: 25000, budget_max: 40000, deadline: '2026-11-01', status: 'open' },
      { employer_id: emp.james, category_id: cat['writing-content'], title: 'Website Copy for SaaS Landing Page', description: 'Write compelling copy for our SaaS landing page.', budget_min: 2000, budget_max: 3500, deadline: '2026-07-18', status: 'completed' },
      { employer_id: emp.emily, category_id: cat['web-development'], title: 'WordPress Plugin Development', description: 'Develop a custom WordPress plugin for our gallery management system.', budget_min: 5000, budget_max: 8000, deadline: '2026-08-05', status: 'cancelled' },
    ]);
    console.log(`Created ${jobs.length} jobs.`);

    // ── Applications ──
    const applications = await Application.bulkCreate([
      { job_id: 1, freelancer_id: free.alex, name: 'Alex Rivera', cover_letter: 'I have built 5+ e-commerce platforms. I can deliver a high-quality solution and am available to start immediately.', status: 'pending' },
      { job_id: 1, freelancer_id: free.david, name: 'David Patel', cover_letter: 'Full-stack developer with React expertise. I have experience building large-scale web applications.', status: 'pending' },
      { job_id: 2, freelancer_id: free.maria, name: 'Maria Garcia', cover_letter: 'PhD in ML with 5 years experience building prediction models. I can deliver in 4 weeks.', status: 'pending' },
      { job_id: 2, freelancer_id: free.alex, name: 'Alex Rivera', cover_letter: 'Experienced with Python ML stack. Can build and deploy the model end-to-end.', status: 'pending' },
      { job_id: 3, freelancer_id: free.david, name: 'David Patel', cover_letter: 'Built 3 fintech apps with React Native. Strong experience with financial APIs.', status: 'pending' },
      { job_id: 3, freelancer_id: free.alex, name: 'Alex Rivera', cover_letter: 'Full-stack developer with experience building secure financial applications.', status: 'pending' },
      { job_id: 4, freelancer_id: free.tom, name: 'Tom Baker', cover_letter: 'AWS Solutions Architect with 7 years experience. I set up similar infrastructure for 3 startups.', status: 'accepted' },
      { job_id: 5, freelancer_id: free.jessica, name: 'Jessica Kim', cover_letter: 'Brand designer with 6 years experience. Portfolio of 20+ brand identities.', status: 'pending' },
      { job_id: 6, freelancer_id: free.alex, name: 'Alex Rivera', cover_letter: 'I can build a stunning portfolio site with a headless CMS. React + Next.js expert.', status: 'pending' },
      { job_id: 6, freelancer_id: free.jessica, name: 'Jessica Kim', cover_letter: 'Designer + developer. I understand both visual and technical requirements.', status: 'pending' },
      { job_id: 7, freelancer_id: free.alex, name: 'Alex Rivera', cover_letter: 'Built 3 SaaS dashboards. Expert in React, D3.js, and real-time data visualization.', status: 'pending' },
      { job_id: 7, freelancer_id: free.david, name: 'David Patel', cover_letter: 'Full-stack developer. Can build this with React + TypeScript.', status: 'pending' },
      { job_id: 8, freelancer_id: free.sophie, name: 'Sophie Williams', cover_letter: 'Technical writer with 4 years experience documenting REST APIs and SDKs.', status: 'accepted' },
      { job_id: 9, freelancer_id: free.david, name: 'David Patel', cover_letter: 'iOS developer with 5 years Swift experience. Can fix bugs and add features.', status: 'accepted' },
      { job_id: 10, freelancer_id: free.tom, name: 'Tom Baker', cover_letter: 'Built API gateways for 2 startups. Node.js + Redis expert.', status: 'pending' },
      { job_id: 10, freelancer_id: free.alex, name: 'Alex Rivera', cover_letter: 'Experienced with microservices architecture and API gateways.', status: 'pending' },
      { job_id: 11, freelancer_id: free.jessica, name: 'Jessica Kim', cover_letter: 'I design social media creatives for 5 brands. Can start immediately.', status: 'pending' },
      { job_id: 12, freelancer_id: free.jessica, name: 'Jessica Kim', cover_letter: 'Expert in design systems and Figma. I can create a comprehensive UI kit.', status: 'pending' },
      { job_id: 13, freelancer_id: free.tom, name: 'Tom Baker', cover_letter: 'CKA certified. I have migrated 4 production systems to Kubernetes.', status: 'pending' },
      { job_id: 14, freelancer_id: free.maria, name: 'Maria Garcia', cover_letter: 'Built real-time ML systems handling 50K+ events/sec. Kafka + TensorFlow expertise.', status: 'pending' },
      { job_id: 15, freelancer_id: free.sophie, name: 'Sophie Williams', cover_letter: 'Conversion-focused copywriter. I increased conversion rates by 40% for my last client.', status: 'accepted' },
    ]);
    console.log(`Created ${applications.length} applications.`);

    // ── Contracts ──
    const contracts = await Contract.bulkCreate([
      { job_id: 4, employer_id: 3, freelancer_id: free.tom, application_id: 7, status: 'active' },
      { job_id: 8, employer_id: 5, freelancer_id: free.sophie, application_id: 13, status: 'active' },
      { job_id: 9, employer_id: 2, freelancer_id: free.david, application_id: 14, status: 'active' },
      { job_id: 15, employer_id: 5, freelancer_id: free.sophie, application_id: 21, status: 'completed' },
    ]);
    console.log(`Created ${contracts.length} contracts.`);

    // ── Reviews ──
    const reviews = await Review.bulkCreate([
      { contract_id: 4, reviewer_id: 5, reviewee_id: free.sophie, rating: 5, comment: 'Sophie delivered excellent copy. Our conversion rate improved significantly!' },
      { contract_id: 4, reviewer_id: free.sophie, reviewee_id: 5, rating: 4, comment: 'Great client to work with. Clear requirements and timely feedback.' },
    ]);
    console.log(`Created ${reviews.length} reviews.`);

    console.log('\n--- Seeding complete! ---');
    console.log('Login credentials:');
    console.log('  Admin:      admin@example.com / admin123');
    console.log('  Employers:  sarah@techcorp.com, mike@startup.io, emily@designlab.com, james@webagency.com');
    console.log('  Freelancers: alex@email.com, jessica@email.com, david@email.com, maria@email.com,');
    console.log('               tom@email.com, sophie@email.com, liam@email.com');
    console.log('  Password:   password123 (for all except admin)');
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

seed();
