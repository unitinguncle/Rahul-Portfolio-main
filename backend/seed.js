/**
 * Seed script — run once to populate MongoDB with existing portfolio data.
 * Usage: cd backend && node seed.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

const Project = require('./models/Project');
const GalleryPost = require('./models/GalleryPost');
const Skill = require('./models/Skill');
const SkillCategory = require('./models/SkillCategory');
const Certificate = require('./models/Certificate');
const BlogPost = require('./models/BlogPost');
const { ResumeSection, ResumeFile } = require('./models/Resume');
const About = require('./models/About');

async function seed() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    // ── Projects ────────────────────────────────────────────
    await Project.deleteMany({});
    await Project.insertMany([
        {
            title: 'Real-Time IoT Data Lakehouse',
            desc: 'Architected pipelines using Azure Event Hubs & Spark Streaming to process 10k+ events/min. Orchestrated with Airflow & ADF for real-time analytics.',
            imageUrl: '',
            tech: ['Azure Event Hubs', 'Spark Streaming', 'Airflow', 'ADF'],
            liveUrl: 'https://github.com/unitinguncle/Azure',
            codeUrl: 'https://github.com/unitinguncle/Azure',
        },
        {
            title: 'Live Retail Store Data Monitoring',
            desc: 'Engineered ETL pipelines using ADF and Databricks. Implemented Medallion Architecture (Bronze/Silver/Gold) on Data Lake for scalable cleaning and refinement.',
            imageUrl: '',
            tech: ['Azure Data Factory', 'Databricks', 'PySpark', 'Delta Lake'],
            liveUrl: 'https://github.com/unitinguncle/DataEngineering-RetailProject',
            codeUrl: 'https://github.com/unitinguncle/DataEngineering-RetailProject',
        },
        {
            title: 'Self Hosted Cloud Media Storage',
            desc: 'Designed a data sovereignty solution (10TB+) using Dockerized Immich on a home server. Integrated Prometheus & Grafana for 24x7 monitoring.',
            imageUrl: '',
            tech: ['Docker', 'Linux', 'Prometheus', 'Grafana', 'Immich'],
            liveUrl: 'https://github.com/unitinguncle/immich',
            codeUrl: 'https://github.com/unitinguncle/immich',
        },
        {
            title: 'Immich Android TV',
            desc: 'An Android TV application interface for the Immich self-hosted photo backup solution, allowing users to view their memories on the big screen.',
            imageUrl: '',
            tech: ['Kotlin', 'Android SDK', 'Immich API'],
            liveUrl: 'https://github.com/unitinguncle/Immich-Android-TV',
            codeUrl: 'https://github.com/unitinguncle/Immich-Android-TV',
        },
        {
            title: 'Ola Maps vs Google Maps',
            desc: 'A comparative analysis and implementation exploring the features and API differences between Ola Maps and Google Maps.',
            imageUrl: '',
            tech: ['JavaScript', 'Maps API', 'Comparison'],
            liveUrl: 'https://github.com/unitinguncle/olamapsVSgooglemaps',
            codeUrl: 'https://github.com/unitinguncle/olamapsVSgooglemaps',
        },
        {
            title: 'Bike Sharing Demand Prediction',
            desc: 'Machine Learning project to predict bike sharing demand using regression techniques. Includes data visualization and model evaluation.',
            imageUrl: '',
            tech: ['Python', 'Scikit-Learn', 'Pandas', 'Data Analysis'],
            liveUrl: 'https://github.com/unitinguncle/Student-Project-Bike-Sharing',
            codeUrl: 'https://github.com/unitinguncle/Student-Project-Bike-Sharing',
        },
    ]);
    console.log('✅ Projects seeded');

    // ── Gallery ─────────────────────────────────────────────
    await GalleryPost.deleteMany({});
    await GalleryPost.insertMany([
        {
            category: 'personal',
            caption: "Lost in the beauty of the Ocean Waves 🌫️ (More on Instagram @r3.rahul)",
            photos: ['/GalleryS/20260101_003105.jpg', '/GalleryS/20260101_124247.jpg', '/GalleryS/20251207_195739.jpg'],
        },
        {
            category: 'personal',
            caption: "Weekend getaway to clear my head 🌄 Sometimes inspiration strikes when you're away from the screen.",
            photos: ['/GalleryS/IMG_20250930_195205544_MF_PORTRAIT.jpg', '/GalleryS/IMG-20250628-WA0041.jpg'],
        },
        {
            category: 'projects',
            caption: "It's an AI-powered tool that understands to help me (and others) get 1% better every day. 🚀",
            photos: ['/GalleryS/projectHabit.jpeg'],
        },
        {
            category: 'achievements',
            caption: '🌟 Reached All India Rank 1 on HackerRank for the day and secured my 5th Gold Star in SQL.🏆!',
            photos: ['/GalleryS/SQLgold.jpg'],
        },
        {
            category: 'achievements',
            caption: "Top of the charts! 🥇 Secured AIR 1 in the Adobe Quiz on Unstop. 🚀 Representing Heritage Institute of Technology (HIT) at the top spot feels amazing! Hard work + Speed = 🏆.",
            photos: ['/GalleryS/AdobeQuiz.jpeg'],
        },
    ]);
    console.log('✅ Gallery seeded');

    // ── Skills ──────────────────────────────────────────────
    await Skill.deleteMany({});
    await Skill.insertMany([
        { name: 'Python', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
        { name: 'C', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg' },
        { name: 'C++', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg' },
        { name: 'Java', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
        { name: 'HTML', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
        { name: 'CSS', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' },
        { name: 'JavaScript', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
        { name: 'React', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
        { name: 'MySQL', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
        { name: 'MongoDB', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
        { name: 'Git', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
    ]);
    console.log('✅ Skills seeded');

    await SkillCategory.deleteMany({});
    await SkillCategory.insertMany([
        { title: 'Programming Languages', items: ['Python', 'C', 'C++', 'Java'], rowIndex: 0, order: 0 },
        { title: 'Web Technologies', items: ['HTML', 'CSS', 'JavaScript', 'React'], rowIndex: 0, order: 1 },
        { title: 'Databases & Tools', items: ['MySQL', 'MongoDB', 'Git'], rowIndex: 0, order: 2 },
        { title: 'Frameworks & Libraries', items: ['React.js', 'Express.js', 'RESTful API'], rowIndex: 0, order: 3 },
        { title: 'Core Concepts', items: ['Data Structures & Algorithms', 'Computer Networks', 'OOPs Concepts', 'DBMS Fundamentals', 'Operating Systems', 'SDLC & Agile Methodologies'], rowIndex: 1, order: 0 },
        { title: 'Soft Skills', items: ['Teamwork', 'Problem Solving', 'Creativity', 'Adaptability', 'Communication'], rowIndex: 1, order: 1 },
    ]);
    console.log('✅ Skill categories seeded');

    // ── Certificates ─────────────────────────────────────────
    await Certificate.deleteMany({});
    await Certificate.insertMany([
        { title: 'Adobe India Hackathon', org: 'Adobe', date: '2024', imageUrl: '/certs/AdobeQuize.png', category: 'tech' },
        { title: 'TATA Crucible Campus Quiz', org: 'Tata Group', date: '2024', imageUrl: '/certs/TataQuiz.png', category: 'tech' },
        { title: 'Introduction to Microsoft Excel', org: 'Microsoft', date: '2025', imageUrl: '/certs/MsExcel.png', category: 'tech' },
        { title: 'Introduction to Python', org: 'Coursera', date: '2023', imageUrl: '/certs/python.png', category: 'other' },
        { title: 'Java Programming', org: 'Udemy', date: '2025', imageUrl: '/certs/java.png', category: 'other' },
        { title: 'Introduction to Programming with MATLAB', org: 'Coursera', date: '2023', imageUrl: '/certs/Matlab.png', category: 'other' },
        { title: 'SQL (Basic to Advanced)', org: 'HackerRank', date: '2025', imageUrl: '/certs/SQL.png', category: 'other' },
        { title: 'Front-End Web Development with React', org: 'HackerRank', date: '2025', imageUrl: '/certs/React.png', category: 'other' },
        { title: 'Web Development', org: 'Udemy', date: '2021', imageUrl: '/certs/webDev.png', category: 'other' },
    ]);
    console.log('✅ Certificates seeded');

    // ── Blog Posts ───────────────────────────────────────────
    await BlogPost.deleteMany({});
    await BlogPost.insertMany([
        {
            title: 'Why I Love Building AI Projects',
            content: '<p>Working on AI-based systems like mammogram cancer detection has taught me how impactful technology can be when applied to healthcare. Combining deep learning with real-world problems is my favorite way to innovate.</p>',
            coverImageUrl: '',
            tags: ['AI', 'Technology', 'Healthcare'],
        },
        {
            title: 'A Broke Man Has No Voice',
            content: '<p>It is a brutal truth: society measures a man\'s worth by his ability to provide. Without financial stability, your opinions often go unheard and your influence remains invisible. Financial independence is dignity.</p>',
            coverImageUrl: '',
            tags: ['Life', 'Finance', 'Mindset'],
        },
        {
            title: 'Nobody Is Coming To Save You',
            content: '<p>We grow up expecting fairness, but the world is indifferent to your struggle. Success is never guaranteed, and sometimes you can do everything right and still lose. You must build your own armor; resilience is your only weapon.</p>',
            coverImageUrl: '',
            tags: ['Mindset', 'Resilience'],
        },
        {
            title: 'There Are No Shortcuts',
            content: '<p>Everyone wants the prize, but few want the pain. Hard work isn\'t just about late nights; it is about showing up when you have zero motivation. Your future is built on the boring, repetitive work you do in the dark.</p>',
            coverImageUrl: '',
            tags: ['Motivation', 'Hard Work'],
        },
        {
            title: 'Money Is A Tool For Freedom',
            content: '<p>They say money can\'t buy happiness, but it buys options. It provides security and the ability to protect the people you love. Ignoring its importance is naive; mastering it is essential for surviving the modern world.</p>',
            coverImageUrl: '',
            tags: ['Finance', 'Freedom', 'Life'],
        },
    ]);
    console.log('✅ Blog posts seeded');

    // ── Resume Sections ──────────────────────────────────────
    await ResumeSection.deleteMany({});
    await ResumeSection.insertMany([
        {
            type: 'profile',
            content: {
                name: 'Rahul Kumar',
                title: 'Data Engineer | Cloud Specialist | 3+ Years Experience',
                location: '📍 New Delhi, Delhi, India',
                email: '✉️ rahulkumar.er4585@gmail.com',
                summary: 'Professional with 3 years of experience improving system reliability and SLA metrics by 15% through data-centric troubleshooting. Leveraging hands-on expertise in Azure Synapse, Databricks, and Airflow to architect scalable ETL pipelines and optimize enterprise data workflows.',
                linkedin: 'https://www.linkedin.com/in/rahul25kumar',
            },
        },
        {
            type: 'experience',
            content: [
                {
                    role: 'Technical Support Executive',
                    company: 'Teleperformance',
                    period: 'Jan 2025 – Present',
                    location: 'Gurugram, Haryana',
                    description: 'Managed escalation point for Equifax data transfer API incidents, reducing P3 incident SLA time by 15%. Resolved FTP and MFT scripting issues using Apache Airflow.',
                },
                {
                    role: 'Advisor',
                    company: 'Concentrix',
                    period: 'Oct 2023 – Jan 2025',
                    location: 'Gurugram, Haryana',
                    description: 'Reduced operational ticket SLA time by 10% on Active Directory and OneDrive issues. Developed Python scripts for ticket assignment system.',
                },
                {
                    role: 'Graduate Engineer Trainee',
                    company: 'NPCI',
                    period: 'Sep 2022 – Feb 2023',
                    location: 'Hyderabad, Telangana',
                    description: 'Implemented MLOPS data pipeline with Apache Airflow achieving 90% automation in Fraud Models. Deployed containerized apps using Docker.',
                },
            ],
        },
        {
            type: 'education',
            content: [
                {
                    degree: 'Bachelor in Technology',
                    institution: 'ST Thomas College of Engineering and Technology (MAKAUT)',
                    period: '2018–2022',
                    gpa: '8.49',
                },
            ],
        },
        {
            type: 'projects',
            content: [
                { title: 'Real-Time IoT Data Lakehouse on Azure', url: 'https://github.com/unitinguncle/Azure', description: 'Architected ingestion pipelines using Azure Event Hubs & Spark Streaming. Orchestrated with Airflow & ADF.' },
                { title: 'Live Retail Store Data Monitoring', url: 'https://github.com/unitinguncle/DataEngineering-RetailProject', description: 'Engineered ADF ETL pipelines for incremental ingestion to ADLS Gen2. Implemented Medallion Architecture on Databricks.' },
                { title: 'Self Hosted Cloud Media Storage', url: 'https://github.com/unitinguncle/immich', description: 'Designed data sovereignty solution on home server (10TB+). Deployed Docker containers for Immich, w/ Prometheus & Grafana monitoring.' },
            ],
        },
        {
            type: 'skills',
            content: ['Azure Data Lake (ADLS)', 'Azure Data Factory (ADF)', 'Azure Databricks', 'Apache Airflow', 'PySpark', 'Delta Lake', 'Docker', 'Python', 'SQL', 'Bash Scripting', 'Prometheus', 'Grafana', 'Power BI', 'Git', 'Linux', 'ServiceNow'],
        },
    ]);
    console.log('✅ Resume sections seeded');

    // ── About ────────────────────────────────────────────────
    await About.deleteMany({});
    await About.create({
        bio: [
            "Hi, I'm <strong>Rahul Kumar</strong>, a professional <strong>Data Engineer</strong> with 3 years of experience improving system reliability and SLA metrics. I specialize in architecting scalable ETL pipelines and optimizing enterprise data workflows using <strong>Azure Synapse, Databricks, and Airflow</strong>.",
            "My expertise lies in Cloud Services (Azure/AWS), Data Engineering (Spark, Delta Lake), and Monitoring (Grafana, Prometheus). I am passionate about data-centric troubleshooting and building robust infrastructure for real-time data processing.",
            "Currently working as a Technical Support Executive at Teleperformance, with previous experience at Concentrix and NPCI.",
        ],
        education: [
            {
                degree: 'Bachelor in Technology',
                institution: 'ST Thomas College of Engineering and Technology (MAKAUT)',
                location: 'Kolkata, West Bengal',
                gpa: '8.49',
                years: '2018 – 2022',
                icon: 'university',
            },
        ],
    });
    console.log('✅ About seeded');

    console.log('\n🎉 All data seeded successfully!');
    await mongoose.disconnect();
    process.exit(0);
}

seed().catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
});
