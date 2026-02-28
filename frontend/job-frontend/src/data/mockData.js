/* ── Mock Data: Jobs, Users, Applications ── */

export const mockJobs = [
    {
        id: 'j1',
        company: 'TechNova',
        role: 'Frontend Developer',
        location: 'Bangalore',
        type: 'full-time',
        salary: 45000,
        deadline: '2026-04-15',
        skillsRequired: ['React', 'JavaScript', 'CSS', 'TypeScript', 'Git'],
        description: 'We are looking for a passionate Frontend Developer to join our product team. You will build beautiful, performant web applications using React and modern tooling. Experience with design systems and component libraries is a plus.',
        applyLink: 'https://technova.careers/frontend',
        createdAt: '2026-02-01'
    },
    {
        id: 'j2',
        company: 'DataWave',
        role: 'Data Analyst Intern',
        location: 'Remote',
        type: 'internship',
        salary: 15000,
        deadline: '2026-03-20',
        skillsRequired: ['Python', 'SQL', 'Excel', 'Tableau'],
        description: 'Join our analytics team as a Data Analyst Intern. You will work with real datasets, create dashboards, and provide insights to stakeholders. Great opportunity for students looking to dive into data analytics.',
        applyLink: 'https://datawave.io/internship',
        createdAt: '2026-02-05'
    },
    {
        id: 'j3',
        company: 'CloudPeak',
        role: 'Full Stack Developer',
        location: 'Hyderabad',
        type: 'full-time',
        salary: 55000,
        deadline: '2026-04-01',
        skillsRequired: ['React', 'Node.js', 'MongoDB', 'Express', 'JavaScript', 'Docker'],
        description: 'CloudPeak is hiring a Full Stack Developer to build and maintain our cloud platform. You will work on both frontend and backend, design APIs, and deploy microservices.',
        applyLink: 'https://cloudpeak.dev/careers',
        createdAt: '2026-02-10'
    },
    {
        id: 'j4',
        company: 'DesignLab',
        role: 'UI/UX Designer',
        location: 'Mumbai',
        type: 'full-time',
        salary: 40000,
        deadline: '2026-03-25',
        skillsRequired: ['Figma', 'Adobe XD', 'CSS', 'User Research', 'Prototyping'],
        description: 'DesignLab is seeking a creative UI/UX Designer to craft stunning user experiences. You will collaborate with product managers and developers to design intuitive interfaces.',
        applyLink: 'https://designlab.co/jobs',
        createdAt: '2026-02-08'
    },
    {
        id: 'j5',
        company: 'SecureNet',
        role: 'Cybersecurity Intern',
        location: 'Delhi',
        type: 'internship',
        salary: 12000,
        deadline: '2026-03-10',
        skillsRequired: ['Networking', 'Linux', 'Python', 'Wireshark'],
        description: 'Learn cybersecurity fundamentals while working on real security challenges. You will assist in vulnerability assessments, penetration testing, and security audits.',
        applyLink: 'https://securenet.in/internship',
        createdAt: '2026-02-03'
    },
    {
        id: 'j6',
        company: 'AIForge',
        role: 'ML Engineer',
        location: 'Remote',
        type: 'full-time',
        salary: 70000,
        deadline: '2026-04-20',
        skillsRequired: ['Python', 'TensorFlow', 'PyTorch', 'Machine Learning', 'Mathematics'],
        description: 'AIForge is looking for an ML Engineer to develop and deploy machine learning models at scale. Experience with NLP or computer vision is highly valued.',
        applyLink: 'https://aiforge.ai/careers',
        createdAt: '2026-02-15'
    },
    {
        id: 'j7',
        company: 'GreenTech',
        role: 'Backend Developer',
        location: 'Pune',
        type: 'full-time',
        salary: 48000,
        deadline: '2026-03-30',
        skillsRequired: ['Node.js', 'Express', 'MongoDB', 'Redis', 'Docker', 'AWS'],
        description: 'Build robust backend systems for our sustainability platform. You will design RESTful APIs, optimize database queries, and implement caching strategies.',
        applyLink: 'https://greentech.co/backend',
        createdAt: '2026-02-12'
    },
    {
        id: 'j8',
        company: 'PixelPerfect',
        role: 'React Developer',
        location: 'Remote',
        type: 'remote',
        salary: 50000,
        deadline: '2026-04-10',
        skillsRequired: ['React', 'JavaScript', 'TypeScript', 'Redux', 'Jest'],
        description: 'PixelPerfect is a fully remote company building design tools. We need a React Developer who is passionate about UI performance and component architecture.',
        applyLink: 'https://pixelperfect.dev/react',
        createdAt: '2026-02-14'
    },
    {
        id: 'j9',
        company: 'EduLearn',
        role: 'Content Developer Intern',
        location: 'Kolkata',
        type: 'internship',
        salary: 10000,
        deadline: '2026-03-15',
        skillsRequired: ['Technical Writing', 'Research', 'Communication'],
        description: 'Help create educational content for our learning platform. You will write tutorials, quizzes, and documentation for programming courses.',
        applyLink: 'https://edulearn.com/intern',
        createdAt: '2026-02-06'
    },
    {
        id: 'j10',
        company: 'FinEdge',
        role: 'Software Engineer',
        location: 'Chennai',
        type: 'full-time',
        salary: 52000,
        deadline: '2026-04-05',
        skillsRequired: ['Java', 'Spring Boot', 'SQL', 'Microservices', 'REST API'],
        description: 'FinEdge is a fintech startup. We are looking for a Software Engineer to build scalable payment processing systems and financial APIs.',
        applyLink: 'https://finedge.io/careers',
        createdAt: '2026-02-11'
    },
    {
        id: 'j11',
        company: 'GameVerse',
        role: 'Game Developer Intern',
        location: 'Bangalore',
        type: 'internship',
        salary: 18000,
        deadline: '2026-03-28',
        skillsRequired: ['Unity', 'C#', 'Game Design', '3D Modeling'],
        description: 'Intern with our game development team to build AR/VR experiences. Ideal for students with a passion for interactive media and gaming.',
        applyLink: 'https://gameverse.studio/intern',
        createdAt: '2026-02-09'
    },
    {
        id: 'j12',
        company: 'DevOps Pro',
        role: 'DevOps Engineer',
        location: 'Remote',
        type: 'remote',
        salary: 62000,
        deadline: '2026-04-18',
        skillsRequired: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Linux', 'Terraform'],
        description: 'Manage and scale cloud infrastructure across multiple environments. Strong experience with containerization and IaC is essential.',
        applyLink: 'https://devopspro.com/engineer',
        createdAt: '2026-02-16'
    },
    {
        id: 'j13',
        company: 'MobiCraft',
        role: 'Mobile App Developer',
        location: 'Noida',
        type: 'full-time',
        salary: 46000,
        deadline: '2026-03-22',
        skillsRequired: ['React Native', 'JavaScript', 'Firebase', 'REST API'],
        description: 'Build cross-platform mobile apps for our e-commerce clients. Experience with React Native and push notifications is essential.',
        applyLink: 'https://mobicraft.in/mobile',
        createdAt: '2026-02-07'
    },
    {
        id: 'j14',
        company: 'TechNova',
        role: 'QA Automation Intern',
        location: 'Bangalore',
        type: 'internship',
        salary: 14000,
        deadline: '2026-02-20',
        skillsRequired: ['Selenium', 'Python', 'Testing', 'JIRA'],
        description: 'Learn test automation in a fast-paced environment. Write automated scripts, track bugs, and improve software quality.',
        applyLink: 'https://technova.careers/qa-intern',
        createdAt: '2026-01-25'
    },
    {
        id: 'j15',
        company: 'DataWave',
        role: 'Backend Engineer',
        location: 'Hyderabad',
        type: 'full-time',
        salary: 58000,
        deadline: '2026-04-12',
        skillsRequired: ['Python', 'Django', 'PostgreSQL', 'Redis', 'Docker'],
        description: 'Build and maintain high-traffic data pipelines and APIs. Strong Python backend skills and experience with relational databases required.',
        applyLink: 'https://datawave.io/backend',
        createdAt: '2026-02-18'
    },
    {
        id: 'j16',
        company: 'CloudPeak',
        role: 'Cloud Architect Intern',
        location: 'Remote',
        type: 'internship',
        salary: 20000,
        deadline: '2026-02-25',
        skillsRequired: ['AWS', 'Cloud Computing', 'Networking', 'Linux'],
        description: 'Get hands-on cloud architecture experience. You will help design and deploy scalable cloud solutions under senior architect mentorship.',
        applyLink: 'https://cloudpeak.dev/intern',
        createdAt: '2026-01-20'
    },
    {
        id: 'j17',
        company: 'PixelPerfect',
        role: 'Technical Writer',
        location: 'Remote',
        type: 'remote',
        salary: 35000,
        deadline: '2026-04-08',
        skillsRequired: ['Technical Writing', 'Markdown', 'Git', 'Documentation'],
        description: 'Write clear and concise technical documentation for our developer tools. Experience with API documentation and developer experience is a plus.',
        applyLink: 'https://pixelperfect.dev/writer',
        createdAt: '2026-02-13'
    },
    {
        id: 'j18',
        company: 'AIForge',
        role: 'Research Intern',
        location: 'Bangalore',
        type: 'internship',
        salary: 22000,
        deadline: '2026-03-18',
        skillsRequired: ['Python', 'Machine Learning', 'Research', 'Mathematics', 'Statistics'],
        description: 'Work alongside researchers on cutting-edge AI projects. Ideal for final-year students interested in pursuing research careers.',
        applyLink: 'https://aiforge.ai/research-intern',
        createdAt: '2026-02-04'
    }
];

// Mock applications (persisted via localStorage in mockApi)
export const defaultApplications = [
    { id: 'a1', jobId: 'j1', status: 'applied', appliedAt: '2026-02-20' },
    { id: 'a2', jobId: 'j3', status: 'interview', appliedAt: '2026-02-18' },
    { id: 'a3', jobId: 'j8', status: 'applied', appliedAt: '2026-02-22' },
];

// Mock bookmarks
export const defaultBookmarks = ['j1', 'j3', 'j6', 'j8'];

// All unique skills across all jobs (for filter)
export const allSkills = [...new Set(mockJobs.flatMap(j => j.skillsRequired))].sort();

// All unique locations
export const allLocations = [...new Set(mockJobs.map(j => j.location))].sort();

// Job types
export const jobTypes = ['full-time', 'internship', 'remote'];
