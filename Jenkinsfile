pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                sh 'npm install'  // Instalar dependencias
                sh 'npm run build'  // Compilar la aplicación
            }
        }
         stage('Unit Tests') {
            steps {
                sh 'npm run test'
            }
        }
        stage('End-to-End Tests') {
            steps { 
                sh 'npm run test:e2e'
            }
        }
        stage('Deploy') {
            steps {
                console.log("hola")
            }
        }
    }
}