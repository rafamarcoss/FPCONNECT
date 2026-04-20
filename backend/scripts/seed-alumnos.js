import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const ALUMNOS = [
  { nombre: "Angel", apellidos: "Amil Cobacho" },
  { nombre: "Álvaro", apellidos: "Caler Montes" },
  { nombre: "Samuel", apellidos: "Calero Ruiz" },
  { nombre: "Manuel", apellidos: "Cañas Pérez Angulo" },
  { nombre: "Daniel", apellidos: "Caparrós García" },
  { nombre: "Miguel", apellidos: "Castilla Gallego" },
  { nombre: "Manuel", apellidos: "Cerezo Galisteo" },
  { nombre: "Alejandro", apellidos: "Cordoba Perez" },
  { nombre: "David Alberto", apellidos: "Cruz Barranco" },
  { nombre: "Bernardo", apellidos: "Cubero Martínez" },
  { nombre: "Elena", apellidos: "Expósito Lara" },
  { nombre: "Germán", apellidos: "Gutiérrez Giménez" },
  { nombre: "Pablo", apellidos: "Herrador Castillo" },
  { nombre: "Alejandro Jonás", apellidos: "Lopez Serrano" },
  { nombre: "Rafael", apellidos: "Marcos Serrano" },
  { nombre: "Jonathan", apellidos: "Martinez Pullana" },
  { nombre: "Rafa", apellidos: "Moreno Moreno" },
  { nombre: "Alberto", apellidos: "Nieto Lozano" },
  { nombre: "María Luisa", apellidos: "Ortega Lucena" },
  { nombre: "David", apellidos: "Pelaez Perez" },
  { nombre: "Alejandro", apellidos: "Prieto Mellado" },
  { nombre: "Jose Antonio", apellidos: "Roda Donoso" },
  { nombre: "Pablo", apellidos: "Rodríguez Casado" },
  { nombre: "Antonio", apellidos: "Rodriguez Cortes" },
  { nombre: "Juan Jose", apellidos: "Rojano Doncel" },
  { nombre: "Daniel", apellidos: "Ronda Morales" },
  { nombre: "Gregorio", apellidos: "Ruiz López" },
  { nombre: "Eduardo", apellidos: "Ruz Lopez" },
  { nombre: "Daniel", apellidos: "Santaflorentina Picchi" },
  { nombre: "Miguel Ángel", apellidos: "Varo Rabadán" }
];

const DESCRIPTIONS = [
  "Apasionado/a por el desarrollo web y las nuevas tecnologías. Buscando siempre nuevos retos para aprender y crecer profesionalmente. Me encanta el frontend.",
  "Estudiante de grado superior con gran interés en la ciberseguridad y la administración de sistemas. Familiarizado/a con entornos Linux y redes.",
  "Desarrollador/a Backend en formación. Disfruto creando APIs robustas y trabajando con bases de datos relacionales y no relacionales. Fan de Node.js y Java.",
  "Entusiasta de la Inteligencia Artificial y el análisis de datos. Siempre experimentando con modelos de Machine Learning y Python.",
  "Con un enfoque creativo para resolver problemas. Me interesa tanto el diseño UI/UX como la implementación técnica. Busco una oportunidad para aplicar mis conocimientos.",
  "Motivado/a y autodidacta. Me gusta estar al día con los últimos frameworks de JavaScript como React y Vue.",
  "Orientado/a a resultados y amante del código limpio y buenas prácticas. Entusiasta de metodologías ágiles y DevOps.",
  "Interesado/a en el desarrollo móvil multiplataforma. Siempre con ganas de crear aplicaciones fluidas y eficientes usando React Native o Flutter."
];

const SKILLS = [
  ["HTML", "CSS", "JavaScript", "React", "Node.js"],
  ["Linux", "Redes", "Docker", "Python", "Bash"],
  ["Java", "Spring Boot", "MySQL", "Git", "Metodologías Ágiles"],
  ["AWS", "CI/CD", "Nginx", "Automatización"],
  ["Figma", "TailwindCSS", "Diseño Web", "Accesibilidad"],
  ["PHP", "Laravel", "SQL", "JavaScript"]
];

const CVS_RESUMEN = [
  "He desarrollado varios proyectos académicos completos, desde el diseño de la base de datos hasta la interfaz del usuario. Actualmente busco prácticas para aplicar mis conocimientos en un entorno real.",
  "Cuenta con un portfolio con ejemplos prácticos en GitHub. Busco siempre aprender de compañeros más experimentados en un equipo multidisciplinar.",
  "Destaco por mi capacidad de adaptación y ganas de absorber conocimientos de mis tutores. Tengo un proyecto Fullstack de e-commerce subido de prueba.",
  "Perfil orientado al aprendizaje continuo y la experimentación en nuevas implementaciones en la nube (AWS/GCP).",
  "Tengo experiencia diseñando esquemas de bases de datos para pequeñas aplicaciones web con React en frontend."
];

async function seedAlumnos() {
    console.log("Comenzando seed de alumnos de tu clase...");
    const hashedPassword = await bcrypt.hash('12345678', 10); // Contraseña estándar para que prueben
    const recoveryAnswerHash = await bcrypt.hash('seguridad', 10);
    
    for (const alumno of ALUMNOS) {
        // Limpiamos los nombres para el correo
        const cleanNombre = alumno.nombre.toLowerCase().replace(/\s+/g, '').normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const cleanApe = alumno.apellidos.toLowerCase().replace(/\s+/g, '').normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const email = `${cleanNombre}.${cleanApe}@fpconnect.es`;
        
        const randomDesc = DESCRIPTIONS[Math.floor(Math.random() * DESCRIPTIONS.length)];
        const randomSkills = SKILLS[Math.floor(Math.random() * SKILLS.length)];
        const randomCVText = CVS_RESUMEN[Math.floor(Math.random() * CVS_RESUMEN.length)];

        // Comprobamos si existe
        const exists = await prisma.user.findUnique({ where: { email } });
        if (exists) {
            console.log(`El usuario ${email} ya existe, omitiendo...`);
            continue;
        }

        try {
            const user = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    firstName: alumno.nombre,
                    lastName: alumno.apellidos,
                    role: 'ALUMNO',
                    bio: randomDesc,
                    isVerified: true,
                    recoveryQuestion: "Palabra de seguridad configurada",
                    recoveryAnswerHash,
                    status: 'ACTIVO',
                }
            });

            // crear perfil estudiante
            await prisma.studentProfile.create({
                data: {
                    userId: user.id,
                    career: "Desarrollo de Aplicaciones Web (DAW)",
                    skills: randomSkills, 
                    // No usamos cvUrl real porque no lo está subiendo nadie. 
                    // Se podría inyectar info o dejar así por el momento
                }
            });
            // Opcional: Generar algún post de introducción
            await prisma.post.create({
               data: {
                 authorId: user.id,
                 content: `¡Hola a todos! Acabo de unirme a la red social de FPConnect.\n\nSoy estudiante y este es un resumen de lo que he hecho:\n${randomCVText}\n\nCon ganas de conectar con compañeros y empresas.`,
                 visibility: "PUBLIC"
               }
            });

            console.log(`✅ Usuario creado: ${alumno.nombre} ${alumno.apellidos} (${email})`);
        } catch(e) {
            console.error("❌ Error creando usaurio", email, e.message);
        }
    }
    
    console.log("¡Seed de alumnos de tu clase completado exitosamente!");
}

seedAlumnos().finally(() => prisma.$disconnect());