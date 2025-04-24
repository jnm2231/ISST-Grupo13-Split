para ver si hay dependencias sin actualizar: mvn versions:display-dependency-updates
para ver si hay un plugin sin actualizar: mvn versions:display-plugin-updates  
para actualizar automaticamente, actualiza el pom.xml(cread backup antes): mvn versions:use-latest-releases 
mvn versions:use-latest-versions
para generar un reporte de las vulnerabilidades de las dependencias: mvn verify
