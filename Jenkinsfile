pipeline {
    agent any
    
    stages {
        stage('Build and Test') {
            steps {
                script {
                    def folders = ['admin_frontend', 'frontend/studio-ghibli', 'backend/gateway', 'backend/users', 'backend/customers', 'backend/courses', 'backend/enrollment']
                    for (folder in folders) {
                        // Modify folder name to replace / with -
                        def repositoryName = folder.replaceAll('/', '-')
                        
                        // Build Docker image
                        sh "docker build -f ./${folder}/Dockerfiles/Dockerfile -t aneeshrp/${repositoryName}:latest ./${folder}"
                        // Run SonarQube analysis
                        //sh "sonar-scanner -Dsonar.projectKey=${repositoryName} -Dsonar.sources=./${folder}"
                    }
                }
            }
        }
        stage('Push to Docker Hub') {
            steps {
                script {
                    // Define Docker Hub credentials ID
                    def dockerHubCredentialsId = 'docker-sg-group-1-cred'
                    
                    // Docker login command with secure password input
                    withCredentials([usernamePassword(credentialsId: dockerHubCredentialsId, passwordVariable: 'DOCKERHUB_PASSWORD', usernameVariable: 'DOCKERHUB_USERNAME')]) {
                        sh "echo \$DOCKERHUB_PASSWORD | docker login -u \$DOCKERHUB_USERNAME --password-stdin"
                    }
                    
                    def folders = ['admin_frontend', 'frontend/studio-ghibli','backend/gateway', 'backend/users', 'backend/customers', 'backend/courses', 'backend/enrollment']
                    for (folder in folders) {
                        // Modify folder name to replace / with -
                        def repositoryName = folder.replaceAll('/', '-')
                        
                        // Push Docker image to Docker Hub
                        sh "docker push aneeshrp/${repositoryName}:latest"
                    }
                }
            }
        }
    }
}