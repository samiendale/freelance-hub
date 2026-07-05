# Database Relationships

## One-to-Many Relationships

### User → Jobs
- **Cardinality**: One Employer has Many Job listings
- **Foreign Key**: `jobs.employer_id` references `users.id`
- **Cascade**: Delete jobs when user is deleted

### User → Applications
- **Cardinality**: One Freelancer has Many Applications
- **Foreign Key**: `applications.freelancer_id` references `users.id`
- **Cascade**: Delete applications when user is deleted

### User → Contracts (as Employer)
- **Cardinality**: One Employer has Many Contracts
- **Foreign Key**: `contracts.employer_id` references `users.id`
- **Cascade**: Delete contracts when user is deleted

### User → Contracts (as Freelancer)
- **Cardinality**: One Freelancer has Many Contracts
- **Foreign Key**: `contracts.freelancer_id` references `users.id`
- **Cascade**: Delete contracts when user is deleted

### User → Notifications
- **Cardinality**: One User has Many Notifications
- **Foreign Key**: `notifications.user_id` references `users.id`
- **Cascade**: Delete notifications when user is deleted

### User → Reviews (as Reviewer)
- **Cardinality**: One User writes Many Reviews
- **Foreign Key**: `reviews.reviewer_id` references `users.id`
- **Cascade**: Delete reviews when user is deleted

### User → Reviews (as Reviewee)
- **Cardinality**: One User receives Many Reviews
- **Foreign Key**: `reviews.reviewee_id` references `users.id`
- **Cascade**: Delete reviews when user is deleted

### Category → Jobs
- **Cardinality**: One Category has Many Jobs
- **Foreign Key**: `jobs.category_id` references `categories.id`
- **Cascade**: Set NULL when category is deleted

### Job → Applications
- **Cardinality**: One Job has Many Applications
- **Foreign Key**: `applications.job_id` references `jobs.id`
- **Cascade**: Delete applications when job is deleted

### Contract → Reviews
- **Cardinality**: One Contract has Many Reviews
- **Foreign Key**: `reviews.contract_id` references `contracts.id`
- **Cascade**: Delete reviews when contract is deleted

## One-to-One Relationships

### Job → Contract
- **Cardinality**: One Job has One Contract
- **Foreign Key**: `contracts.job_id` references `jobs.id`
- **Cascade**: Delete contract when job is deleted

### Application → Contract
- **Cardinality**: One Application creates One Contract
- **Foreign Key**: `contracts.application_id` references `applications.id`
- **Cascade**: Delete contract when application is deleted
