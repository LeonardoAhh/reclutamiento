// ========================================
// BANCO DE PREGUNTAS PSICOMÉTRICAS
// Viñoplastic - Sistema de Reclutamiento
// ========================================

// Configuración de secciones
export const testSections = [
    {
        id: 'disc',
        name: 'Perfil de Personalidad DISC',
        description: 'Evalúa tu estilo de comportamiento en el trabajo',
        icon: '🎯',
        timeEstimate: 5,
        instructions: 'Indica qué tan de acuerdo estás con cada afirmación usando la escala del 1 al 5.'
    },
    {
        id: 'bigFive',
        name: 'Rasgos de Personalidad',
        description: 'Explora tus características personales',
        icon: '⭐',
        timeEstimate: 5,
        instructions: 'Responde según cómo te comportas habitualmente, no cómo te gustaría ser.'
    },
    {
        id: 'aptitudes',
        name: 'Aptitudes Cognitivas',
        description: 'Evalúa tus habilidades lógicas, numéricas y verbales',
        icon: '🧠',
        timeEstimate: 10,
        instructions: 'Selecciona la respuesta correcta para cada pregunta. Tienes tiempo limitado.'
    },
    {
        id: 'competencies',
        name: 'Competencias Laborales',
        description: 'Evalúa tus competencias en el entorno de trabajo',
        icon: '💼',
        timeEstimate: 5,
        instructions: 'Indica qué tan frecuentemente realizas las siguientes acciones en tu trabajo o vida diaria.'
    },
    {
        id: 'emotionalIntelligence',
        name: 'Inteligencia Emocional',
        description: 'Evalúa tu capacidad de gestionar emociones',
        icon: '❤️',
        timeEstimate: 5,
        instructions: 'Responde honestamente sobre cómo manejas tus emociones y relaciones.'
    }
];

// Escala Likert estándar
export const likertScale = [
    { value: 1, label: 'Totalmente en desacuerdo' },
    { value: 2, label: 'En desacuerdo' },
    { value: 3, label: 'Neutral' },
    { value: 4, label: 'De acuerdo' },
    { value: 5, label: 'Totalmente de acuerdo' }
];

export const frequencyScale = [
    { value: 1, label: 'Nunca' },
    { value: 2, label: 'Raramente' },
    { value: 3, label: 'A veces' },
    { value: 4, label: 'Frecuentemente' },
    { value: 5, label: 'Siempre' }
];

// ========================================
// DISC - 20 preguntas
// ========================================
export const discQuestions = [
    // Dominancia (D) - 5 preguntas
    {
        id: 'd1', category: 'disc', subcategory: 'dominance', type: 'likert',
        text: 'Me gusta tomar decisiones rápidas y asumir el control de las situaciones.'
    },
    {
        id: 'd2', category: 'disc', subcategory: 'dominance', type: 'likert',
        text: 'Prefiero enfrentar los problemas directamente en lugar de evitarlos.'
    },
    {
        id: 'd3', category: 'disc', subcategory: 'dominance', type: 'likert',
        text: 'Me siento cómodo compitiendo con otros para lograr mis metas.'
    },
    {
        id: 'd4', category: 'disc', subcategory: 'dominance', type: 'likert',
        text: 'Suelo expresar mis opiniones de manera directa y sin rodeos.'
    },
    {
        id: 'd5', category: 'disc', subcategory: 'dominance', type: 'likert',
        text: 'Me impaciento cuando las cosas no avanzan al ritmo que quiero.'
    },

    // Influencia (I) - 5 preguntas
    {
        id: 'i1', category: 'disc', subcategory: 'influence', type: 'likert',
        text: 'Disfruto conocer gente nueva y hacer contactos.'
    },
    {
        id: 'i2', category: 'disc', subcategory: 'influence', type: 'likert',
        text: 'Me resulta fácil persuadir a otros para que vean las cosas desde mi perspectiva.'
    },
    {
        id: 'i3', category: 'disc', subcategory: 'influence', type: 'likert',
        text: 'Prefiero un ambiente de trabajo animado y con mucha interacción social.'
    },
    {
        id: 'i4', category: 'disc', subcategory: 'influence', type: 'likert',
        text: 'Me gusta ser el centro de atención en reuniones y eventos.'
    },
    {
        id: 'i5', category: 'disc', subcategory: 'influence', type: 'likert',
        text: 'Tiendo a ser optimista incluso en situaciones difíciles.'
    },

    // Estabilidad (S) - 5 preguntas
    {
        id: 's1', category: 'disc', subcategory: 'steadiness', type: 'likert',
        text: 'Prefiero un ambiente de trabajo estable y predecible.'
    },
    {
        id: 's2', category: 'disc', subcategory: 'steadiness', type: 'likert',
        text: 'Me tomo el tiempo necesario para pensar antes de actuar.'
    },
    {
        id: 's3', category: 'disc', subcategory: 'steadiness', type: 'likert',
        text: 'Valoro mucho la lealtad y las relaciones a largo plazo.'
    },
    {
        id: 's4', category: 'disc', subcategory: 'steadiness', type: 'likert',
        text: 'Me resulta difícil adaptarme a cambios repentinos.'
    },
    {
        id: 's5', category: 'disc', subcategory: 'steadiness', type: 'likert',
        text: 'Prefiero trabajar en equipo antes que solo.'
    },

    // Cumplimiento (C) - 5 preguntas
    {
        id: 'c1', category: 'disc', subcategory: 'compliance', type: 'likert',
        text: 'Me gusta seguir procedimientos y reglas establecidas.'
    },
    {
        id: 'c2', category: 'disc', subcategory: 'compliance', type: 'likert',
        text: 'Presto mucha atención a los detalles en mi trabajo.'
    },
    {
        id: 'c3', category: 'disc', subcategory: 'compliance', type: 'likert',
        text: 'Prefiero tener toda la información antes de tomar una decisión.'
    },
    {
        id: 'c4', category: 'disc', subcategory: 'compliance', type: 'likert',
        text: 'Me esfuerzo por mantener altos estándares de calidad.'
    },
    {
        id: 'c5', category: 'disc', subcategory: 'compliance', type: 'likert',
        text: 'Soy muy organizado y metódico en mi forma de trabajar.'
    }
];

// ========================================
// BIG FIVE - 20 preguntas
// ========================================
export const bigFiveQuestions = [
    // Apertura (Openness) - 4 preguntas
    {
        id: 'o1', category: 'bigFive', subcategory: 'openness', type: 'likert',
        text: 'Disfruto explorando nuevas ideas y perspectivas.'
    },
    {
        id: 'o2', category: 'bigFive', subcategory: 'openness', type: 'likert',
        text: 'Me gusta experimentar con diferentes formas de hacer las cosas.'
    },
    {
        id: 'o3', category: 'bigFive', subcategory: 'openness', type: 'likert',
        text: 'Tengo una imaginación muy activa.'
    },
    {
        id: 'o4', category: 'bigFive', subcategory: 'openness', type: 'likert',
        text: 'Me interesan temas artísticos y culturales.'
    },

    // Responsabilidad (Conscientiousness) - 4 preguntas
    {
        id: 'r1', category: 'bigFive', subcategory: 'conscientiousness', type: 'likert',
        text: 'Siempre cumplo con mis compromisos y plazos.'
    },
    {
        id: 'r2', category: 'bigFive', subcategory: 'conscientiousness', type: 'likert',
        text: 'Planifico mis actividades con anticipación.'
    },
    {
        id: 'r3', category: 'bigFive', subcategory: 'conscientiousness', type: 'likert',
        text: 'Soy persistente hasta completar mis tareas.'
    },
    {
        id: 'r4', category: 'bigFive', subcategory: 'conscientiousness', type: 'likert',
        text: 'Mantengo mis espacios de trabajo ordenados.'
    },

    // Extroversión (Extraversion) - 4 preguntas
    {
        id: 'e1', category: 'bigFive', subcategory: 'extraversion', type: 'likert',
        text: 'Me siento energizado después de estar con otras personas.'
    },
    {
        id: 'e2', category: 'bigFive', subcategory: 'extraversion', type: 'likert',
        text: 'Inicio conversaciones fácilmente con desconocidos.'
    },
    {
        id: 'e3', category: 'bigFive', subcategory: 'extraversion', type: 'likert',
        text: 'Disfruto siendo el líder en actividades grupales.'
    },
    {
        id: 'e4', category: 'bigFive', subcategory: 'extraversion', type: 'likert',
        text: 'Prefiero un ritmo de vida activo y dinámico.'
    },

    // Amabilidad (Agreeableness) - 4 preguntas
    {
        id: 'a1', category: 'bigFive', subcategory: 'agreeableness', type: 'likert',
        text: 'Me preocupo genuinamente por el bienestar de los demás.'
    },
    {
        id: 'a2', category: 'bigFive', subcategory: 'agreeableness', type: 'likert',
        text: 'Evito los conflictos siempre que es posible.'
    },
    {
        id: 'a3', category: 'bigFive', subcategory: 'agreeableness', type: 'likert',
        text: 'Confío fácilmente en las intenciones de otras personas.'
    },
    {
        id: 'a4', category: 'bigFive', subcategory: 'agreeableness', type: 'likert',
        text: 'Me resulta natural ayudar a otros sin esperar nada a cambio.'
    },

    // Neuroticismo (Neuroticism) - 4 preguntas (reverse scored)
    {
        id: 'n1', category: 'bigFive', subcategory: 'neuroticism', type: 'likert', reverse: true,
        text: 'Me preocupo frecuentemente por cosas que podrían salir mal.'
    },
    {
        id: 'n2', category: 'bigFive', subcategory: 'neuroticism', type: 'likert', reverse: true,
        text: 'Me resulta difícil manejar el estrés.'
    },
    {
        id: 'n3', category: 'bigFive', subcategory: 'neuroticism', type: 'likert', reverse: true,
        text: 'Mis emociones cambian frecuentemente durante el día.'
    },
    {
        id: 'n4', category: 'bigFive', subcategory: 'neuroticism', type: 'likert', reverse: true,
        text: 'Me afectan mucho las críticas de otras personas.'
    }
];

// ========================================
// APTITUD LÓGICA - 10 preguntas
// ========================================
export const logicalQuestions = [
    {
        id: 'l1', category: 'logical', type: 'multiple',
        text: '¿Cuál es el siguiente número en la secuencia: 2, 6, 12, 20, 30, ?',
        options: ['38', '40', '42', '44'],
        correctAnswer: '42'
    },
    {
        id: 'l2', category: 'logical', type: 'multiple',
        text: 'Si todos los Bloops son Razzies y todos los Razzies son Lazzies, entonces todos los Bloops son definitivamente:',
        options: ['Razzies solamente', 'Lazzies solamente', 'Razzies y Lazzies', 'Ninguna de las anteriores'],
        correctAnswer: 'Razzies y Lazzies'
    },
    {
        id: 'l3', category: 'logical', type: 'multiple',
        text: '¿Cuál figura completa la serie? □ ○ △ □ ○ △ □ ○ ?',
        options: ['□', '○', '△', '◇'],
        correctAnswer: '△'
    },
    {
        id: 'l4', category: 'logical', type: 'multiple',
        text: 'María es más alta que Ana. Ana es más alta que Laura. ¿Quién es la más baja?',
        options: ['María', 'Ana', 'Laura', 'No se puede determinar'],
        correctAnswer: 'Laura'
    },
    {
        id: 'l5', category: 'logical', type: 'multiple',
        text: 'Si CASA = 4 y MESA = 4, entonces COMPUTADORA = ?',
        options: ['10', '11', '12', '13'],
        correctAnswer: '11'
    },
    {
        id: 'l6', category: 'logical', type: 'multiple',
        text: '¿Cuál es el siguiente en la secuencia: A, C, F, J, O, ?',
        options: ['S', 'T', 'U', 'V'],
        correctAnswer: 'U'
    },
    {
        id: 'l7', category: 'logical', type: 'multiple',
        text: 'Un reloj marca las 3:15. ¿Cuál es el ángulo entre las manecillas?',
        options: ['0°', '7.5°', '15°', '30°'],
        correctAnswer: '7.5°'
    },
    {
        id: 'l8', category: 'logical', type: 'multiple',
        text: 'Si 5 máquinas hacen 5 piezas en 5 minutos, ¿cuántas piezas hacen 100 máquinas en 100 minutos?',
        options: ['100', '500', '1000', '2000'],
        correctAnswer: '2000'
    },
    {
        id: 'l9', category: 'logical', type: 'multiple',
        text: '¿Qué palabra no pertenece al grupo: Perro, Gato, Pájaro, Tetera, Elefante?',
        options: ['Perro', 'Pájaro', 'Tetera', 'Elefante'],
        correctAnswer: 'Tetera'
    },
    {
        id: 'l10', category: 'logical', type: 'multiple',
        text: 'Si el día de ayer fue dos días después del lunes, ¿qué día es hoy?',
        options: ['Miércoles', 'Jueves', 'Viernes', 'Sábado'],
        correctAnswer: 'Jueves'
    }
];

// ========================================
// APTITUD NUMÉRICA - 10 preguntas
// ========================================
export const numericalQuestions = [
    {
        id: 'n1', category: 'numerical', type: 'multiple',
        text: 'Si un producto cuesta $800 y tiene un descuento del 25%, ¿cuál es el precio final?',
        options: ['$600', '$650', '$700', '$750'],
        correctAnswer: '$600'
    },
    {
        id: 'n2', category: 'numerical', type: 'multiple',
        text: '¿Cuál es el 15% de 340?',
        options: ['45', '51', '55', '61'],
        correctAnswer: '51'
    },
    {
        id: 'n3', category: 'numerical', type: 'multiple',
        text: 'Si 3/4 de un número es 60, ¿cuál es el número?',
        options: ['45', '75', '80', '90'],
        correctAnswer: '80'
    },
    {
        id: 'n4', category: 'numerical', type: 'multiple',
        text: 'Un empleado gana $12,000 mensuales. Si recibe un aumento del 8%, ¿cuánto ganará?',
        options: ['$12,800', '$12,960', '$13,000', '$13,200'],
        correctAnswer: '$12,960'
    },
    {
        id: 'n5', category: 'numerical', type: 'multiple',
        text: 'Si un auto recorre 450 km con 50 litros de gasolina, ¿cuántos km recorre por litro?',
        options: ['7 km', '8 km', '9 km', '10 km'],
        correctAnswer: '9 km'
    },
    {
        id: 'n6', category: 'numerical', type: 'multiple',
        text: '¿Cuánto es 2.5 × 4.8?',
        options: ['10', '11', '12', '13'],
        correctAnswer: '12'
    },
    {
        id: 'n7', category: 'numerical', type: 'multiple',
        text: 'Si la relación entre hombres y mujeres en una empresa es 3:5 y hay 120 empleados, ¿cuántas mujeres hay?',
        options: ['45', '60', '72', '75'],
        correctAnswer: '75'
    },
    {
        id: 'n8', category: 'numerical', type: 'multiple',
        text: 'Un proyecto se completó al 60% en 12 días. ¿Cuántos días tomará completarlo al 100%?',
        options: ['18 días', '20 días', '22 días', '24 días'],
        correctAnswer: '20 días'
    },
    {
        id: 'n9', category: 'numerical', type: 'multiple',
        text: 'Si compras 3 productos a $45.50 cada uno, ¿cuánto pagas en total?',
        options: ['$135.50', '$136.00', '$136.50', '$137.50'],
        correctAnswer: '$136.50'
    },
    {
        id: 'n10', category: 'numerical', type: 'multiple',
        text: '¿Cuál es la media aritmética de: 15, 20, 25, 30, 35?',
        options: ['22', '23', '24', '25'],
        correctAnswer: '25'
    }
];

// ========================================
// APTITUD VERBAL - 10 preguntas
// ========================================
export const verbalQuestions = [
    {
        id: 'v1', category: 'verbal', type: 'multiple',
        text: '¿Cuál es el sinónimo de "efímero"?',
        options: ['Eterno', 'Pasajero', 'Sólido', 'Permanente'],
        correctAnswer: 'Pasajero'
    },
    {
        id: 'v2', category: 'verbal', type: 'multiple',
        text: 'Completa la analogía: Médico es a Hospital como Maestro es a:',
        options: ['Libro', 'Escuela', 'Estudiante', 'Clase'],
        correctAnswer: 'Escuela'
    },
    {
        id: 'v3', category: 'verbal', type: 'multiple',
        text: '¿Cuál es el antónimo de "prolijo"?',
        options: ['Detallado', 'Conciso', 'Extenso', 'Elaborado'],
        correctAnswer: 'Conciso'
    },
    {
        id: 'v4', category: 'verbal', type: 'multiple',
        text: 'Identifica la palabra que no pertenece: Alegría, Felicidad, Tristeza, Júbilo, Gozo',
        options: ['Alegría', 'Felicidad', 'Tristeza', 'Gozo'],
        correctAnswer: 'Tristeza'
    },
    {
        id: 'v5', category: 'verbal', type: 'multiple',
        text: '¿Qué significa "perspicaz"?',
        options: ['Lento para entender', 'Agudo mental', 'Físicamente fuerte', 'Visualmente atractivo'],
        correctAnswer: 'Agudo mental'
    },
    {
        id: 'v6', category: 'verbal', type: 'multiple',
        text: 'Completa: "La ____ del problema fue identificada rápidamente."',
        options: ['Raíz', 'Rama', 'Hoja', 'Flor'],
        correctAnswer: 'Raíz'
    },
    {
        id: 'v7', category: 'verbal', type: 'multiple',
        text: '¿Cuál oración está correctamente escrita?',
        options: ['Ayer fuistes a la tienda', 'Ayer fuiste a la tienda', 'Ayer fui a la tienda tu', 'Ayer fuesté a la tienda'],
        correctAnswer: 'Ayer fuiste a la tienda'
    },
    {
        id: 'v8', category: 'verbal', type: 'multiple',
        text: 'Libro es a Biblioteca como Cuadro es a:',
        options: ['Pintor', 'Museo', 'Marco', 'Arte'],
        correctAnswer: 'Museo'
    },
    {
        id: 'v9', category: 'verbal', type: 'multiple',
        text: '¿Cuál es el sinónimo de "inherente"?',
        options: ['Externo', 'Intrínseco', 'Adquirido', 'Superficial'],
        correctAnswer: 'Intrínseco'
    },
    {
        id: 'v10', category: 'verbal', type: 'multiple',
        text: 'Si "benévolo" significa bondadoso, "malévolo" significa:',
        options: ['Generoso', 'Malintencionado', 'Neutral', 'Indiferente'],
        correctAnswer: 'Malintencionado'
    }
];

// ========================================
// COMPETENCIAS LABORALES - 15 preguntas
// ========================================
export const competencyQuestions = [
    // Trabajo en equipo - 3 preguntas
    {
        id: 'te1', category: 'competencies', subcategory: 'teamwork', type: 'frequency',
        text: 'Busco activamente formas de ayudar a mis compañeros de equipo.'
    },
    {
        id: 'te2', category: 'competencies', subcategory: 'teamwork', type: 'frequency',
        text: 'Comparto información y recursos con otros miembros del equipo.'
    },
    {
        id: 'te3', category: 'competencies', subcategory: 'teamwork', type: 'frequency',
        text: 'Pongo los objetivos del equipo por encima de mis objetivos personales.'
    },

    // Liderazgo - 3 preguntas
    {
        id: 'li1', category: 'competencies', subcategory: 'leadership', type: 'frequency',
        text: 'Tomo la iniciativa para coordinar actividades grupales.'
    },
    {
        id: 'li2', category: 'competencies', subcategory: 'leadership', type: 'frequency',
        text: 'Motivo a otros a dar lo mejor de sí mismos.'
    },
    {
        id: 'li3', category: 'competencies', subcategory: 'leadership', type: 'frequency',
        text: 'Proporciono retroalimentación constructiva a mis colegas.'
    },

    // Resolución de problemas - 3 preguntas
    {
        id: 'rp1', category: 'competencies', subcategory: 'problemSolving', type: 'frequency',
        text: 'Analizo las situaciones desde múltiples perspectivas antes de actuar.'
    },
    {
        id: 'rp2', category: 'competencies', subcategory: 'problemSolving', type: 'frequency',
        text: 'Propongo soluciones creativas a problemas complejos.'
    },
    {
        id: 'rp3', category: 'competencies', subcategory: 'problemSolving', type: 'frequency',
        text: 'Identifico la causa raíz de los problemas en lugar de solo los síntomas.'
    },

    // Comunicación - 3 preguntas
    {
        id: 'co1', category: 'competencies', subcategory: 'communication', type: 'frequency',
        text: 'Expreso mis ideas de manera clara y estructurada.'
    },
    {
        id: 'co2', category: 'competencies', subcategory: 'communication', type: 'frequency',
        text: 'Escucho activamente a otros antes de responder.'
    },
    {
        id: 'co3', category: 'competencies', subcategory: 'communication', type: 'frequency',
        text: 'Adapto mi estilo de comunicación según la audiencia.'
    },

    // Adaptabilidad - 3 preguntas
    {
        id: 'ad1', category: 'competencies', subcategory: 'adaptability', type: 'frequency',
        text: 'Me adapto fácilmente a nuevos procesos y tecnologías.'
    },
    {
        id: 'ad2', category: 'competencies', subcategory: 'adaptability', type: 'frequency',
        text: 'Mantengo la calma y productividad ante cambios inesperados.'
    },
    {
        id: 'ad3', category: 'competencies', subcategory: 'adaptability', type: 'frequency',
        text: 'Veo los cambios como oportunidades de mejora.'
    }
];

// ========================================
// INTELIGENCIA EMOCIONAL - 15 preguntas
// ========================================
export const emotionalIntelligenceQuestions = [
    // Autoconciencia - 3 preguntas
    {
        id: 'ac1', category: 'emotionalIntelligence', subcategory: 'selfAwareness', type: 'frequency',
        text: 'Reconozco mis fortalezas y debilidades con objetividad.'
    },
    {
        id: 'ac2', category: 'emotionalIntelligence', subcategory: 'selfAwareness', type: 'frequency',
        text: 'Identifico mis emociones en el momento en que las experimento.'
    },
    {
        id: 'ac3', category: 'emotionalIntelligence', subcategory: 'selfAwareness', type: 'frequency',
        text: 'Entiendo cómo mis emociones afectan mi desempeño.'
    },

    // Autorregulación - 3 preguntas
    {
        id: 'ar1', category: 'emotionalIntelligence', subcategory: 'selfRegulation', type: 'frequency',
        text: 'Mantengo la calma en situaciones de alta presión.'
    },
    {
        id: 'ar2', category: 'emotionalIntelligence', subcategory: 'selfRegulation', type: 'frequency',
        text: 'Pienso antes de actuar cuando estoy molesto.'
    },
    {
        id: 'ar3', category: 'emotionalIntelligence', subcategory: 'selfRegulation', type: 'frequency',
        text: 'Me recupero rápidamente de las decepciones.'
    },

    // Motivación - 3 preguntas
    {
        id: 'mo1', category: 'emotionalIntelligence', subcategory: 'motivation', type: 'frequency',
        text: 'Me esfuerzo por superar mis propias expectativas.'
    },
    {
        id: 'mo2', category: 'emotionalIntelligence', subcategory: 'motivation', type: 'frequency',
        text: 'Mantengo una actitud positiva incluso ante los obstáculos.'
    },
    {
        id: 'mo3', category: 'emotionalIntelligence', subcategory: 'motivation', type: 'frequency',
        text: 'Busco constantemente formas de mejorar en mi trabajo.'
    },

    // Empatía - 3 preguntas
    {
        id: 'em1', category: 'emotionalIntelligence', subcategory: 'empathy', type: 'frequency',
        text: 'Puedo percibir cómo se sienten otras personas sin que me lo digan.'
    },
    {
        id: 'em2', category: 'emotionalIntelligence', subcategory: 'empathy', type: 'frequency',
        text: 'Considero los sentimientos de otros al tomar decisiones.'
    },
    {
        id: 'em3', category: 'emotionalIntelligence', subcategory: 'empathy', type: 'frequency',
        text: 'Me pongo en el lugar de otros para entender su perspectiva.'
    },

    // Habilidades sociales - 3 preguntas
    {
        id: 'hs1', category: 'emotionalIntelligence', subcategory: 'socialSkills', type: 'frequency',
        text: 'Manejo los conflictos de manera constructiva.'
    },
    {
        id: 'hs2', category: 'emotionalIntelligence', subcategory: 'socialSkills', type: 'frequency',
        text: 'Construyo relaciones positivas con diferentes tipos de personas.'
    },
    {
        id: 'hs3', category: 'emotionalIntelligence', subcategory: 'socialSkills', type: 'frequency',
        text: 'Inspiro confianza en las personas con las que trabajo.'
    }
];

// ========================================
// FUNCIONES DE UTILIDAD
// ========================================

// Obtener todas las preguntas mezcladas por sección
export const getAllQuestions = () => {
    return [
        ...discQuestions,
        ...bigFiveQuestions,
        ...logicalQuestions,
        ...numericalQuestions,
        ...verbalQuestions,
        ...competencyQuestions,
        ...emotionalIntelligenceQuestions
    ];
};

// Obtener preguntas por sección
export const getQuestionsBySection = (sectionId) => {
    switch (sectionId) {
        case 'disc':
            return discQuestions;
        case 'bigFive':
            return bigFiveQuestions;
        case 'aptitudes':
            return [...logicalQuestions, ...numericalQuestions, ...verbalQuestions];
        case 'competencies':
            return competencyQuestions;
        case 'emotionalIntelligence':
            return emotionalIntelligenceQuestions;
        default:
            return [];
    }
};

// Mezclar array (Fisher-Yates shuffle)
export const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

// Obtener preguntas aleatorias de cada categoría
export const getRandomizedQuestions = () => {
    return {
        disc: shuffleArray(discQuestions),
        bigFive: shuffleArray(bigFiveQuestions),
        aptitudes: {
            logical: shuffleArray(logicalQuestions),
            numerical: shuffleArray(numericalQuestions),
            verbal: shuffleArray(verbalQuestions)
        },
        competencies: shuffleArray(competencyQuestions),
        emotionalIntelligence: shuffleArray(emotionalIntelligenceQuestions)
    };
};

// Labels para mostrar en UI
export const scoreLabels = {
    disc: {
        dominance: 'Dominancia',
        influence: 'Influencia',
        steadiness: 'Estabilidad',
        compliance: 'Cumplimiento'
    },
    bigFive: {
        openness: 'Apertura',
        conscientiousness: 'Responsabilidad',
        extraversion: 'Extroversión',
        agreeableness: 'Amabilidad',
        neuroticism: 'Estabilidad Emocional'
    },
    aptitudes: {
        logical: 'Razonamiento Lógico',
        numerical: 'Aptitud Numérica',
        verbal: 'Aptitud Verbal'
    },
    competencies: {
        teamwork: 'Trabajo en Equipo',
        leadership: 'Liderazgo',
        problemSolving: 'Resolución de Problemas',
        communication: 'Comunicación',
        adaptability: 'Adaptabilidad'
    },
    emotionalIntelligence: {
        selfAwareness: 'Autoconciencia',
        selfRegulation: 'Autorregulación',
        motivation: 'Motivación',
        empathy: 'Empatía',
        socialSkills: 'Habilidades Sociales'
    }
};
