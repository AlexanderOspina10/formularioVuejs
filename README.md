# Formulario de Registro

Aplicación de formulario de registro multipaso desarrollada con Vue 3 y Vite. Implementa un flujo de registro en tres pasos con validación en tiempo real y diseño responsive.

## Instalación y Uso

Instalar dependencias:
npm install

Ejecutar en desarrollo:
npm run dev

## Tecnologías Utilizadas

Vue 3 - Composition API con script setup
Vite - Bundler y desarrollo rápido
Tailwind CSS - Framework de estilos
API REST Countries - Listado de países

## Características Técnicas

Gestión de Estado:
Reactividad con Composition API
Estado por paso con ref() y computed()
Inyección de datos con provide/inject

Comunicación entre Componentes:
Props y v-model para datos bidireccionales
Emits para eventos de validación
Métodos expuestos con defineExpose()

Experiencia de Usuario:
Progreso visual entre pasos
Spinners durante validación
Modal de éxito animado
Scroll automático a errores
Indicadores de fortaleza de contraseña

## Características Principales

Flujo de Registro:
3 Pasos de Registro: Información personal, contacto y residencia
Validación en Tiempo Real: Por campo y por paso
Navegación Inteligente: Avance condicionado a validación exitosa
Resumen Automático: Consolidación de datos ingresados al finalizar

Componentes:
Componentes reutilizables: Input, Select, Date, FileField
Diseño modular y mantenible
Props y eventos bien definidos

Validaciones:
Validación de email, edad mínima, documentos y archivos JPG
Validación robusta en cada campo

Diseño Responsive:
Mobile: 1 columna, optimizado para pantallas pequeñas
Tablet: 2 columnas en grid
Desktop: Layout completo con máximo 4xl
