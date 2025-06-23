import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [pokeQuery, setPokeQuery] = useState('');
  const [currentPokemon, setCurrentPokemon] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    alert('Bienvenido querido usuario ❤️');
  }, []);

  const handleSearch = async (e) => {
    if (e.key === 'Enter') {
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokeQuery.toLowerCase()}`);
        if (!res.ok) throw new Error('No se encontró el Pokémon');
        const data = await res.json();
        const pokemon = {
          name: data.name,
          image: data.sprites.front_default,
          stats: data.stats,
          moves: data.moves.slice(0, 5).map(m => m.move.name),
        };
        setCurrentPokemon(pokemon);
        setLiked(false); // reset like al buscar otro
      } catch (err) {
        alert(err.message);
        setCurrentPokemon(null);
      }
    }
  };

  const handleFavorite = () => {
    if (currentPokemon && !liked) {
      setFavorites([...favorites, { ...currentPokemon, id: Date.now() }]);
      setLiked(true);
    } else if (liked) {
      
      alert('Ya marcaste este Pokémon como Me gusta ❤️');
    }
  };

  const handleChat = async () => {
    const input = document.getElementById('chatInput').value.trim();
    if (!input || !currentPokemon) return;
    setChatMessages([...chatMessages, { text: input, sender: 'user' }]);

    const payload = {
      contents: [
        {
          parts: [
            {
              text: `Háblame de los stats y habilidades de ${currentPokemon.name}. Pregunta adicional: ${input}`,
            },
          ],
        },
      ],
    };

    try {
      const response = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyA1iF_6KHUlHlUNUZry0ixf2td-EiDv5Qo',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );
      const result = await response.json();
      const aiText = result.candidates?.[0]?.content?.parts?.[0]?.text || 'No hubo respuesta de la IA.';
      setChatMessages(prev => [...prev, { text: aiText, sender: 'ai' }]);
    } catch {
      setChatMessages(prev => [...prev, { text: 'Error al conectar con la IA.', sender: 'ai' }]);
    }

    document.getElementById('chatInput').value = '';
  };

  return (
    <div className="container py-4">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">Pokedex de Javo</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link" href="#bottom">Pokemones</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#" onClick={() => window.location.reload()}>Refrescar</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <h1 className="text-center mb-4">Poke Javon</h1>

      <div className="input-group mb-3">
        <input
          className="form-control"
          type="text"
          placeholder="Buscar Pokémon por nombre..."
          value={pokeQuery}
          onChange={(e) => setPokeQuery(e.target.value)}
          onKeyDown={handleSearch}
        />
        <button
          className={`btn me-gusta-btn ${liked ? 'liked' : ''}`}
          onClick={handleFavorite}
          type="button"
        >
          Me gusta ❤️
        </button>
      </div>

      {currentPokemon && (
        <div className="card mb-3 text-center bg-light">
          <div className="card-body">
            <h5 className="card-title">{currentPokemon.name.toUpperCase()}</h5>
            <img src={currentPokemon.image} alt="pokemon" className="img-fluid" />
          </div>
        </div>
      )}

      <input id="chatInput" className="form-control mb-2" type="text" placeholder="Pregúntale a Gemini sobre este Pokémon..." />
      <button className="btn custom-button mb-3" onClick={handleChat}>Hablemos</button>

      <div className="chat-box mb-4">
        {chatMessages.map((msg, idx) => (
          <div key={idx} className={`chat-message ${msg.sender === 'user' ? 'user-message' : 'ai-message'}`}>
            {msg.text}
          </div>
        ))}
      </div>

      <h3 className="mt-5">Favoritos</h3>
      <div className="row g-3">
        {favorites.map(fav => (
          <div className="col-12 col-sm-6 col-lg-4" key={fav.id}>
            <div className="card favorite-card text-white">
              <img src={fav.image} className="card-img-top" alt={fav.name} />
              <div className="card-body text-center">
                <h5 className="card-title">{fav.name.toUpperCase()}</h5>
                <button className="btn custom-button mb-2" data-bs-toggle="collapse" data-bs-target={`#details-${fav.id}`}>
                  Detalles
                </button>
                <div className="collapse" id={`details-${fav.id}`}>
                  <button
                    className="btn custom-button me-2 mt-2"
                    onClick={() => alert('Stats:\n' + fav.stats.map(s => `${s.stat.name.toUpperCase()}: ${s.base_stat}`).join('\n'))}
                  >
                    Stats
                  </button>
                  <button
                    className="btn custom-button mt-2"
                    onClick={() => alert('Movimientos:\n' + fav.moves.join('\n'))}
                  >
                    Ataques
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div id="bottom"></div>
    </div>
  );
};

export default App;


import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

