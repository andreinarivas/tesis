# tesis
Como hacer que esto funcione
1. Copias todo el repositorio
2. Reemplazas el contenido en Back -> firebase-sdk.json por el que te mandé por whatsapp
3. Installar por python #pip install pipenv
4. abres la carpeta de Back en la terminal y corres:
pipenv install (solo la primera vez)
pipenv shell
python manage.py runserver
maybe hace falta que instales la versión 3.9 de python (yo lo tuve que hacer solo tienes que buscarla en internets)
6. abres la carpeta de Front en la terminal y corres:
npm install --legacy-peer-deps
set NODE_OPTIONS=--openssl-legacy-provider && npm run dev


