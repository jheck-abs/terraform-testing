# Dockerfile

# 1. Basis-Image von Node.js holen (Version 20)
FROM node:20

# 2. Arbeitsverzeichnis im Container setzen
WORKDIR /app

# 3. package.json und package-lock.json kopieren
COPY package*.json ./

# 4. Abhängigkeiten installieren
RUN npm install

# 5. Projektdateien kopieren
COPY . .

# 6. Container-Startbefehl definieren
CMD ["npm", "start"]
