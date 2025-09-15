// src/components/DevProject/DevProject.jsx
import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaExternalLinkAlt, FaGithub, FaRocket, FaStar, FaFilter } from 'react-icons/fa';
import { websites, categories } from '../../data/websites';
import styles from './DevProject.module.css';

const DevProject = () => {
    const [activeFilter, setActiveFilter] = useState('All');
    const [selectedProject, setSelectedProject] = useState(null);
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

    // Filter projects based on active category
    const filteredProjects = activeFilter === 'All'
        ? websites
        : websites.filter(project => project.category === activeFilter);

    const openModal = (project) => {
        setSelectedProject(project);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setSelectedProject(null);
        document.body.style.overflow = 'unset';
    };

    return (
        <section className={styles.devProjectSection} id="projects" ref={sectionRef}>
            {/* Background Elements */}
            <div className={styles.backgroundElements}>
                <motion.div
                    className={styles.gradientOrb}
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.2, 0.1]
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </div>

            <div className={styles.container}>
                {/* Header */}
                <motion.div
                    className={styles.header}
                    initial={{ opacity: 0, y: 50 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <span className={styles.sectionTag}>
                        <FaRocket /> Our Portfolio
                    </span>
                    <h2 className={styles.title}>Development Projects</h2>
                    <p className={styles.subtitle}>
                        Discover our diverse portfolio of web development projects that demonstrate our expertise in creating innovative digital solutions
                    </p>
                </motion.div>

                {/* Filter Tabs */}
                <motion.div
                    className={styles.filterContainer}
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <div className={styles.filterTabs}>
                        <FaFilter className={styles.filterIcon} />
                        {categories.map((category) => (
                            <motion.button
                                key={category}
                                className={`${styles.filterTab} ${activeFilter === category ? styles.active : ''}`}
                                onClick={() => setActiveFilter(category)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {category}
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                {/* Projects Grid */}
                <motion.div
                    className={styles.projectsContainer}
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    <div className={styles.projectGrid}>
                        {filteredProjects.map((project, index) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                index={index}
                                onViewDetails={() => openModal(project)}
                            />
                        ))}
                    </div>
                </motion.div>

                {/* Stats Section */}
                <motion.div
                    className={styles.statsSection}
                    initial={{ opacity: 0, y: 50 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: 1 }}
                >
                    <div className={styles.statsGrid}>
                        <div className={styles.statItem}>
                            <h3>50+</h3>
                            <p>Projects Delivered</p>
                        </div>
                        <div className={styles.statItem}>
                            <h3>100%</h3>
                            <p>Client Satisfaction</p>
                        </div>
                        <div className={styles.statItem}>
                            <h3>24/7</h3>
                            <p>Support Available</p>
                        </div>
                        <div className={styles.statItem}>
                            <h3>5★</h3>
                            <p>Average Rating</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Project Modal */}
            {selectedProject && (
                <ProjectModal project={selectedProject} onClose={closeModal} />
            )}
        </section>
    );
};

// Project Card Component
const ProjectCard = ({ project, index, onViewDetails }) => {
    return (
        <motion.div
            className={`${styles.projectCard} ${project.featured ? styles.featured : ''}`}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ y: -10, scale: 1.02 }}
        >
            {project.featured && (
                <div className={styles.featuredBadge}>
                    <FaStar /> Featured
                </div>
            )}

            <div className={styles.imageContainer}>
                <img
                    src={project.image}
                    alt={`${project.title} Screenshot`}
                    className={styles.projectImage}
                    loading="lazy"
                />
                <div className={styles.imageOverlay}>
                    <div className={styles.overlayContent}>
                        <motion.button
                            className={styles.viewButton}
                            onClick={onViewDetails}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            View Details
                        </motion.button>
                        <motion.a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.liveButton}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <FaExternalLinkAlt /> Live Site
                        </motion.a>
                    </div>
                </div>
            </div>

            <div className={styles.projectInfo}>
                <div className={styles.projectHeader}>
                    <h3 className={styles.projectTitle}>{project.title}</h3>
                    <span className={styles.projectYear}>{project.year}</span>
                </div>
                <p className={styles.projectSubtitle}>{project.subtitle}</p>
                <p className={styles.projectDescription}>{project.description}</p>

                <div className={styles.projectMeta}>
                    <div className={styles.techStack}>
                        {project.technologies.slice(0, 3).map((tech, idx) => (
                            <span key={idx} className={styles.techTag}>{tech}</span>
                        ))}
                        {project.technologies.length > 3 && (
                            <span className={styles.techMore}>+{project.technologies.length - 3}</span>
                        )}
                    </div>
                    <div className={styles.projectMetrics}>
                        <span className={styles.metric}>
                            ⚡ {project.metrics.loadTime}
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// Project Modal Component
const ProjectModal = ({ project, onClose }) => {
    return (
        <motion.div
            className={styles.modalBackdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className={styles.modalContainer}
                initial={{ opacity: 0, scale: 0.8, y: 100 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 100 }}
                onClick={(e) => e.stopPropagation()}
            >
                <button className={styles.closeButton} onClick={onClose}>×</button>

                <div className={styles.modalImage}>
                    <img src={project.image} alt={project.title} />
                </div>

                <div className={styles.modalContent}>
                    <div className={styles.modalHeader}>
                        <h2>{project.title}</h2>
                        <p className={styles.modalSubtitle}>{project.subtitle}</p>
                    </div>

                    <div className={styles.modalDetails}>
                        <div className={styles.detailRow}>
                            <strong>Client:</strong> {project.client}
                        </div>
                        <div className={styles.detailRow}>
                            <strong>Industry:</strong> {project.industry}
                        </div>
                        <div className={styles.detailRow}>
                            <strong>Year:</strong> {project.year}
                        </div>
                        <div className={styles.detailRow}>
                            <strong>Status:</strong> <span className={styles.liveStatus}>{project.status}</span>
                        </div>
                    </div>

                    <p className={styles.modalDescription}>{project.description}</p>

                    <div className={styles.modalTech}>
                        <h4>Technologies Used:</h4>
                        <div className={styles.techList}>
                            {project.technologies.map((tech, idx) => (
                                <span key={idx} className={styles.techBadge}>{tech}</span>
                            ))}
                        </div>
                    </div>

                    <div className={styles.modalFeatures}>
                        <h4>Key Features:</h4>
                        <ul>
                            {project.features.map((feature, idx) => (
                                <li key={idx}>{feature}</li>
                            ))}
                        </ul>
                    </div>

                    <div className={styles.modalActions}>
                        <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.visitButton}
                        >
                            <FaExternalLinkAlt /> Visit Website
                        </a>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default DevProject;
