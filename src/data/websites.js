// src/data/websites.js

export const websites = [
    {
        id: 1,
        title: "Redix Solutions",
        subtitle: "Digital Agency Website",
        url: "https://www.redixsolutions.pro/",
        description: "Official website of Redix Digital Solutions showcasing our comprehensive digital services, team expertise, and portfolio. Built with modern React architecture and responsive design principles.",
        image: "/assets/screenshots/redix-solutions.png",
        category: "Corporate",
        industry: "Digital Agency",
        year: "2024",
        client: "Internal Project",
        status: "Live",
        featured: true,
        technologies: ["React", "Framer Motion", "CSS Modules", "Vite"],
        features: ["Responsive Design", "SEO Optimized", "Performance Optimized", "Modern UI"],
        metrics: {
            loadTime: "< 2s",
            lighthouse: "95+",
            responsive: "100%"
        }
    },
    {
        id: 2,
        title: "Pexa Portfolio",
        subtitle: "Personal Developer Portfolio",
        url: "https://yassinejeridi.github.io/pexa/",
        description: "A sleek personal portfolio website for Yassine Jeridi showcasing coding projects, technical skills, and professional experience with clean design and smooth interactions.",
        image: "/assets/screenshots/pexa-portfolio.png",
        category: "Portfolio",
        industry: "Personal Branding",
        year: "2024",
        client: "Yassine Jeridi",
        status: "Live",
        featured: true,
        technologies: ["HTML5", "CSS3", "JavaScript", "GitHub Pages"],
        features: ["Interactive Design", "Project Showcase", "Skills Display", "Contact Integration"],
        metrics: {
            loadTime: "< 1.5s",
            lighthouse: "92+",
            responsive: "100%"
        }
    },
    {
        id: 3,
        title: "CIMEF Clinic",
        subtitle: "Healthcare Website",
        url: "https://yassinejeridi.github.io/CIMEF/",
        description: "Professional healthcare website for CIMEF clinic featuring service information, doctor profiles, appointment booking system, and patient resources with accessibility-first design.",
        image: "/assets/screenshots/cimef-clinic.png",
        category: "Healthcare",
        industry: "Medical Services",
        year: "2024",
        client: "CIMEF Clinic",
        status: "Live",
        featured: false,
        technologies: ["HTML5", "Bootstrap", "CSS3", "JavaScript"],
        features: ["Service Catalog", "Doctor Profiles", "Accessibility", "Mobile Optimized"],
        metrics: {
            loadTime: "< 2s",
            lighthouse: "89+",
            responsive: "100%"
        }
    },
    {
        id: 4,
        title: "The House RB",
        subtitle: "Real Estate Platform",
        url: "https://yassinejeridi.github.io/TheHouseRB/",
        description: "Modern real estate website for The House RB featuring property listings, advanced search filters, virtual tours, and integrated contact system for seamless client experience.",
        image: "/assets/screenshots/thehouse-rb.png",
        category: "Real Estate",
        industry: "Property Management",
        year: "2024",
        client: "The House RB",
        status: "Live",
        featured: false,
        technologies: ["HTML5", "CSS3", "JavaScript", "Local Storage"],
        features: ["Property Listings", "Search Filters", "Image Galleries", "Contact Forms"],
        metrics: {
            loadTime: "< 2.5s",
            lighthouse: "87+",
            responsive: "100%"
        }
    }
];

// Export categories for filtering
export const categories = [
    "All",
    "Corporate",
    "Portfolio",
    "Healthcare",
    "Real Estate"
];

export default websites;
