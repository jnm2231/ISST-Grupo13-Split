# split.it – Gestión de gastos compartidos

Este proyecto es un prototipo básico de split.it, una aplicación para la gestión de gastos compartidos entre varias personas. Ha sido desarrollado como parte de una práctica universitaria siguiendo una metodología ágil basada en Scrum.

## 🛠️ Tecnologías utilizadas

- Backend: Java + Spring Boot
- Frontend: React
- Sistema de compilación: Maven
- Control de versiones: Git

---

## ▶️ Ejecución del proyecto

### Frontend

Para iniciar la aplicación cliente:

```bash
npm install    # Sólo la primera vez
npm run dev
```
La aplicación se abrirá en el navegador, normalmente en http://localhost:5173.

### Backend
Para compilar y ejecutar el servidor backend:

```bash
./mvnw clean install spring-boot:run -DskipTests=true
```
El backend arrancará en http://localhost:8080.

## 🔧 Mantenimiento del proyecto
Revisión y actualización de dependencias
Ver versiones disponibles de dependencias:
```bash
mvn versions:display-dependency-updates
```
Ver versiones disponibles de plugins:
```bash
mvn versions:display-plugin-updates
```
Actualizar dependencias automáticamente (⚠️ haz backup del pom.xml antes):
```bash
mvn versions:use-latest-releases
mvn versions:use-latest-versions
```
Análisis de vulnerabilidades
Generar informe de seguridad y validación:
```bash
mvn verify
```

Para acceder a la base de datos introduce http://localhost:8080/h2-console

## 📄 Licencia
Este proyecto es sólo con fines educativos y no cuenta con una licencia de uso comercial.
