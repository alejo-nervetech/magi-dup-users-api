FROM node:22

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

# Source must be copied BEFORE build so src/ exists
COPY . .

RUN npm run build
# Create uploads directory
RUN mkdir -p uploads

# Add this ↓
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Change CMD to use the entrypoint ↓
CMD ["./docker-entrypoint.sh"]
