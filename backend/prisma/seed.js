// Seed de datos de ejemplo para demo
import bcrypt from 'bcrypt';
import prisma from '../src/config/prisma.js';
import logger from '../src/config/logger.js';

const DEMO_PASSWORD = 'Password123';

const centers = [
  {
    email: 'iescartuja.fp@demo.com',
    firstName: 'IES Cartuja',
    lastName: 'FP',
    centerName: 'IES Cartuja',
    city: 'Granada',
    province: 'Granada',
    cicles: ['GS: DAM', 'GS: DAW', 'GS: ASIR', 'GE: IA y Big Data'],
    posts: [
      'Abrimos plazas para FCT en DAM y DAW con empresas tecnológicas de Granada. Solicitudes hasta el 30 de abril.',
      'Jornada de puertas abiertas este viernes a las 17:00 para familias interesadas en ciclos de informática.',
    ],
  },
  {
    email: 'politecnico.malaga@demo.com',
    firstName: 'Politécnico',
    lastName: 'Málaga',
    centerName: 'IES Politécnico Jesús Marín',
    city: 'Málaga',
    province: 'Málaga',
    cicles: ['GM: SMR', 'GS: DAM', 'GS: ASIR', 'GE: Ciberseguridad en entornos IT'],
    posts: [
      'Nuevo convenio con empresas de ciberseguridad para alumnado de ASIR. Inicio de prácticas en mayo.',
      'Publicado el calendario de pruebas de acceso a ciclos de grado superior para el curso 2026/2027.',
    ],
  },
  {
    email: 'triana.sevilla@demo.com',
    firstName: 'IES Triana',
    lastName: 'FP',
    centerName: 'IES Triana',
    city: 'Sevilla',
    province: 'Sevilla',
    cicles: ['GS: DAW', 'GS: DAM'],
    posts: [
      'Buscamos proyectos colaborativos con startups sevillanas para alumnado de segundo de DAW.',
    ],
  },
  {
    email: 'lafuensanta.cordoba@demo.com',
    firstName: 'IES La Fuensanta',
    lastName: 'FP',
    centerName: 'IES La Fuensanta',
    city: 'Córdoba',
    province: 'Córdoba',
    cicles: ['GM: SMR', 'GS: DAW'],
    posts: [
      'Taller intensivo de empleabilidad tecnológica: preparación de CV, LinkedIn y entrevistas técnicas.',
    ],
  },
  {
    email: 'zaframar.huelva@demo.com',
    firstName: 'IES Zaframar',
    lastName: 'FP',
    centerName: 'IES Zaframar',
    city: 'Huelva',
    province: 'Huelva',
    cicles: ['GS: DAM', 'GM: SMR'],
    posts: [
      'Publicadas las becas de movilidad para realizar prácticas duales en empresas colaboradoras de Huelva.',
    ],
  },
];

const demoStudents = [
  {
    email: 'alumno@test.com',
    firstName: 'Juan',
    lastName: 'Garcia',
    location: 'Granada, Andalucia',
    bio: 'Estudiante DAM con foco en backend Node.js y APIs REST. Busco FCT en desarrollo de producto.',
    cicle: 'DAM',
    specialization: 'Desarrollo de Aplicaciones Multiplataforma',
    courseYear: 2,
    graduationYear: 2026,
    experience: 'Proyecto final: app de gestion academica con React, Node.js, Prisma y PostgreSQL. Participacion en hackathon universitario.',
    skills: ['JavaScript', 'Node.js', 'Express', 'Prisma', 'PostgreSQL', 'React', 'Git'],
    projects: [
      'FPConnect Clone: red profesional para estudiantes de FP',
      'TaskFlow: gestor de tareas en tiempo real con Socket.io',
    ],
    cvUrl: 'https://example.com/cv/juan-garcia-dam.pdf',
    certificatesUrl: [
      'https://example.com/certs/juan-javascript.pdf',
      'https://example.com/certs/juan-postgresql.pdf',
    ],
    seekingJob: true,
    jobPreferences: {
      modalidad: 'Hibrido',
      jornada: 'Completa',
      tecnologias: ['Node.js', 'React', 'SQL'],
      ciudades: ['Granada', 'Malaga', 'Sevilla'],
    },
    linkedinUrl: 'https://www.linkedin.com/in/juan-garcia-fp',
    portfolioUrl: 'https://portfolio.juan-garcia.dev',
    centerEmail: 'iescartuja.fp@demo.com',
  },
  {
    email: 'marta.romero@demo.com',
    firstName: 'Marta',
    lastName: 'Romero',
    location: 'Malaga, Andalucia',
    bio: 'Perfil DAW orientado a frontend y UX. Me gusta convertir requisitos en interfaces limpias y accesibles.',
    cicle: 'DAW',
    specialization: 'Desarrollo de Aplicaciones Web',
    courseYear: 2,
    graduationYear: 2026,
    experience: 'Practicas internas en departamento TIC del centro. Colaboracion en web para asociacion local.',
    skills: ['React', 'Vite', 'CSS', 'TypeScript', 'Figma', 'Testing Library'],
    projects: [
      'Portal FP Jobs con filtros avanzados y dashboard',
      'UI Kit accesible para componentes educativos',
    ],
    cvUrl: 'https://example.com/cv/marta-romero-daw.pdf',
    certificatesUrl: [
      'https://example.com/certs/marta-frontend.pdf',
    ],
    seekingJob: true,
    jobPreferences: {
      modalidad: 'Remoto',
      jornada: 'Completa',
      tecnologias: ['React', 'TypeScript', 'Design Systems'],
      ciudades: ['Malaga', 'Remote'],
    },
    linkedinUrl: 'https://www.linkedin.com/in/marta-romero-fp',
    portfolioUrl: 'https://marta-ui.dev',
    centerEmail: 'politecnico.malaga@demo.com',
  },
  {
    email: 'pablo.sanchez@demo.com',
    firstName: 'Pablo',
    lastName: 'Sanchez',
    location: 'Sevilla, Andalucia',
    bio: 'Alumno ASIR y especialista en redes/sistemas. Interesado en roles de ciberseguridad junior.',
    cicle: 'ASIR',
    specialization: 'Administracion de Sistemas Informaticos en Red',
    courseYear: 2,
    graduationYear: 2026,
    experience: 'Laboratorio virtual con hardening Linux, segmentacion de red y monitorizacion con Grafana.',
    skills: ['Linux', 'Docker', 'Bash', 'Networking', 'Cybersecurity', 'Nginx'],
    projects: [
      'SOC educativo con ELK + alertas basicas',
      'Automatizacion de despliegues con scripts bash',
    ],
    cvUrl: 'https://example.com/cv/pablo-sanchez-asir.pdf',
    certificatesUrl: [
      'https://example.com/certs/pablo-linux.pdf',
      'https://example.com/certs/pablo-cybersecurity.pdf',
    ],
    seekingJob: true,
    jobPreferences: {
      modalidad: 'Presencial',
      jornada: 'Completa',
      tecnologias: ['Linux', 'Redes', 'Ciberseguridad'],
      ciudades: ['Sevilla', 'Cadiz'],
    },
    linkedinUrl: 'https://www.linkedin.com/in/pablo-sanchez-fp',
    portfolioUrl: 'https://pablo-systems.dev',
    centerEmail: 'triana.sevilla@demo.com',
  },
  {
    email: 'laura.nieto@demo.com',
    firstName: 'Laura',
    lastName: 'Nieto',
    location: 'Cordoba, Andalucia',
    bio: 'Estudiante SMR con mucho interes por soporte IT, microservicios y mantenimiento de infraestructuras.',
    cicle: 'SMR',
    specialization: 'Sistemas Microinformaticos y Redes',
    courseYear: 2,
    graduationYear: 2026,
    experience: 'Soporte tecnico en aula TIC y mantenimiento de parque informatico del centro.',
    skills: ['Hardware', 'Windows Server', 'Virtualizacion', 'Helpdesk', 'Office 365'],
    projects: [
      'Inventario IT con etiquetas QR y panel web',
      'Plan de mantenimiento preventivo para centro educativo',
    ],
    cvUrl: 'https://example.com/cv/laura-nieto-smr.pdf',
    certificatesUrl: [
      'https://example.com/certs/laura-helpdesk.pdf',
    ],
    seekingJob: false,
    jobPreferences: {
      modalidad: 'Presencial',
      jornada: 'Parcial',
      tecnologias: ['Helpdesk', 'Sistemas', 'Virtualizacion'],
      ciudades: ['Cordoba'],
    },
    linkedinUrl: 'https://www.linkedin.com/in/laura-nieto-fp',
    portfolioUrl: 'https://laura-tech-lab.dev',
    centerEmail: 'lafuensanta.cordoba@demo.com',
  },
  {
    email: 'sergio.morales@demo.com',
    firstName: 'Sergio',
    lastName: 'Morales',
    location: 'Huelva, Andalucia',
    bio: 'Alumno DAM con perfil fullstack. Muy comodo construyendo APIs y paneles de administracion.',
    cicle: 'DAM',
    specialization: 'Desarrollo de Aplicaciones Multiplataforma',
    courseYear: 1,
    graduationYear: 2027,
    experience: 'Desarrollo de mini ERP academico para gestion de practicas y seguimiento de alumnado.',
    skills: ['Java', 'Spring Boot', 'PostgreSQL', 'React', 'REST APIs'],
    projects: [
      'Mini ERP FCT para tutorias y empresas',
      'API de notificaciones push para eventos academicos',
    ],
    cvUrl: 'https://example.com/cv/sergio-morales-dam.pdf',
    certificatesUrl: [
      'https://example.com/certs/sergio-java.pdf',
    ],
    seekingJob: true,
    jobPreferences: {
      modalidad: 'Hibrido',
      jornada: 'Completa',
      tecnologias: ['Java', 'Spring', 'React'],
      ciudades: ['Huelva', 'Sevilla'],
    },
    linkedinUrl: 'https://www.linkedin.com/in/sergio-morales-fp',
    portfolioUrl: 'https://sergiodevfolio.dev',
    centerEmail: 'zaframar.huelva@demo.com',
  },
];

const ensurePost = async (authorId, content) => {
  const existingPost = await prisma.post.findFirst({
    where: { authorId, content },
    select: { id: true },
  });

  if (!existingPost) {
    await prisma.post.create({
      data: {
        authorId,
        content,
        visibility: 'PUBLIC',
      },
    });
  }
};

const seedDatabase = async () => {
  try {
    logger.info('🌱 Iniciando seed de BD...');
    const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 10);

    const centerIdsByEmail = {};
    const createdCenterIds = [];

    // Centros FP de ejemplo de Andalucia
    for (const center of centers) {
      const centerUser = await prisma.user.upsert({
        where: { email: center.email },
        update: {
          firstName: center.firstName,
          lastName: center.lastName,
          role: 'CENTRO',
          status: 'ACTIVO',
          location: `${center.city}, ${center.province}`,
          bio: `${center.centerName} - Centro de FP en ${center.city}`,
        },
        create: {
          email: center.email,
          password: hashedPassword,
          firstName: center.firstName,
          lastName: center.lastName,
          role: 'CENTRO',
          status: 'ACTIVO',
          location: `${center.city}, ${center.province}`,
          bio: `${center.centerName} - Centro de FP en ${center.city}`,
        },
      });

      await prisma.centerProfile.upsert({
        where: { userId: centerUser.id },
        update: {
          centerName: center.centerName,
          city: center.city,
          province: center.province,
          cicles: JSON.stringify(center.cicles),
        },
        create: {
          userId: centerUser.id,
          centerName: center.centerName,
          city: center.city,
          province: center.province,
          cicles: JSON.stringify(center.cicles),
        },
      });

      for (const content of center.posts) {
        await ensurePost(centerUser.id, content);
      }

      centerIdsByEmail[center.email] = centerUser.id;
      createdCenterIds.push(centerUser.id);
    }

    const createdStudentIds = [];

    // Estudiantes demo con perfil completo y CV de ejemplo
    for (const student of demoStudents) {
      const studentUser = await prisma.user.upsert({
        where: { email: student.email },
        update: {
          firstName: student.firstName,
          lastName: student.lastName,
          role: 'ALUMNO',
          status: 'ACTIVO',
          location: student.location,
          bio: student.bio,
          linkedinUrl: student.linkedinUrl,
          portfolioUrl: student.portfolioUrl,
        },
        create: {
          email: student.email,
          password: hashedPassword,
          firstName: student.firstName,
          lastName: student.lastName,
          role: 'ALUMNO',
          status: 'ACTIVO',
          location: student.location,
          bio: student.bio,
          linkedinUrl: student.linkedinUrl,
          portfolioUrl: student.portfolioUrl,
        },
      });

      await prisma.studentProfile.upsert({
        where: { userId: studentUser.id },
        update: {
          cicle: student.cicle,
          specialization: student.specialization,
          courseYear: student.courseYear,
          graduationYear: student.graduationYear,
          experience: student.experience,
          skills: JSON.stringify(student.skills),
          projects: JSON.stringify(student.projects),
          cvUrl: student.cvUrl,
          certificatesUrl: JSON.stringify(student.certificatesUrl),
          seekingJob: student.seekingJob,
          jobPreferences: JSON.stringify(student.jobPreferences),
        },
        create: {
          userId: studentUser.id,
          cicle: student.cicle,
          specialization: student.specialization,
          courseYear: student.courseYear,
          graduationYear: student.graduationYear,
          experience: student.experience,
          skills: JSON.stringify(student.skills),
          projects: JSON.stringify(student.projects),
          cvUrl: student.cvUrl,
          certificatesUrl: JSON.stringify(student.certificatesUrl),
          seekingJob: student.seekingJob,
          jobPreferences: JSON.stringify(student.jobPreferences),
        },
      });

      const linkedCenterId = centerIdsByEmail[student.centerEmail];
      if (linkedCenterId) {
        await prisma.connection.upsert({
          where: {
            followerId_followingId: {
              followerId: studentUser.id,
              followingId: linkedCenterId,
            },
          },
          update: { status: 'ACTIVE' },
          create: {
            followerId: studentUser.id,
            followingId: linkedCenterId,
            status: 'ACTIVE',
          },
        });
      }

      createdStudentIds.push(studentUser.id);
    }

    // Hacer que todos los alumnos sigan a los centros de demo para que aparezcan en su feed
    const alumnos = await prisma.user.findMany({
      where: { role: 'ALUMNO', status: 'ACTIVO' },
      select: { id: true },
    });

    for (const alumno of alumnos) {
      for (const centerId of createdCenterIds) {
        await prisma.connection.upsert({
          where: {
            followerId_followingId: {
              followerId: alumno.id,
              followingId: centerId,
            },
          },
          update: { status: 'ACTIVE' },
          create: {
            followerId: alumno.id,
            followingId: centerId,
            status: 'ACTIVE',
          },
        });
      }
    }

    logger.info(`✅ Seed completado: ${createdCenterIds.length} centros y ${createdStudentIds.length} alumnos de demo creados/actualizados`);
  } catch (error) {
    logger.error('❌ Error en seed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

seedDatabase();
