const YAML = require('yamljs');
const path = require('path');

// Load YAML files
const mainDoc = YAML.load(path.join(__dirname, '../../docs/main.yaml'));
const authDoc = YAML.load(path.join(__dirname, '../../docs/auth.yaml'));

// Merge documents
const swaggerDocs = {
  ...mainDoc,
  paths: {
    ...mainDoc.paths,
    ...authDoc.paths
  },
  components: {
    ...mainDoc.components,
    schemas: {
      ...authDoc.components.schemas
    }
  }
};

module.exports = swaggerDocs;
