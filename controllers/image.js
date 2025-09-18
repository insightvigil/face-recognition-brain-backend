

// --- NUEVA FUNCIÓN PARA LLAMAR A CLARIFAI ---
const handleApiCall = (req, res) => {
  // Tu PAT (llave de API) ahora está segura en el backend.
  // Es mejor usar variables de entorno, como process.env.CLARIFAI_PAT
  const PAT = '557c14de7ba941b08ac00854fee53f75'; // REEMPLAZA ESTO O USA VARIABLES DE ENTORNO
  const USER_ID = 'insightvigil';
  const APP_ID = 'test';
  
  // Obtenemos la URL de la imagen que envía el frontend
  const { imageUrl } = req.body;

  const raw = JSON.stringify({
    "user_app_id": {
      "user_id": USER_ID,
      "app_id": APP_ID
    },
    "inputs": [
      {
        "data": {
          "image": {
            "url": imageUrl
          }
        }
      }
    ]
  });

  const requestOptions = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Key ' + PAT
    },
    body: raw
  };
  
  fetch("https://api.clarifai.com/v2/models/face-detection/versions/6dc7e46bc9124c5c8824be4822abe105/outputs", requestOptions)
    .then(response => response.json())
    .then(data => {
      res.json(data);
    })
    .catch(err => res.status(400).json('No se pudo conectar con la API de Clarifai'));
}

// --- TU FUNCIÓN ORIGINAL MEJORADA ---
const handleImage = (req,res,db) => { // Eliminamos bcrypt porque no se usa aquí
    const { id } = req.body;
    db('users')
    .where('id','=',id)
    .increment('entries',1)
    .returning('entries')
    .then(entries => {
        // Añadimos una comprobación por si el usuario no se encuentra
        if (entries.length) {
            res.json(entries[0].entries)
        } else {
            res.status(400).json('Usuario no encontrado')
        }
    })
    .catch(err => { res.status(400).json('No se pudo actualizar el contador')})
}

// Exportamos ambas funciones para que tu server.js pueda usarlas
module.exports = {
    handleImage: handleImage,
    handleApiCall: handleApiCall
}

