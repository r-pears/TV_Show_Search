async function searchShows(query) {
  let response = await axios.get(
    `http://api.tvmaze.com/search/shows?q=${query}`
  );
  let tvShows = response.data.map((result) => {
    let show = result.show;
    return {
      id: show.id,
      name: show.name,
      summary: show.summary ? show.summary : 'No available information.',
      image: show.image
        ? show.image.medium
        : `https://cdn.pixabay.com/photo/2015/03/16/10/35/tv-675819_960_720.png`,
    };
  });
  return tvShows;
}

function populateShows(shows) {
  const $showsList = $('#shows-list');
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
         <img class="card-img-top" src="${show.image}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button class='btn btn-secondary' id='showEpisodes'>Episodes</button>
           </div>
         </div>
       </div>
      `
    );

    $showsList.append($item);
  }
}

$('#search-form').on('submit', async function handleSearch(evt) {
  evt.preventDefault();

  let query = $('#search-query').val();
  if (!query) return;
  $('#search-query').val('');

  $('#episodes-area').hide();

  let shows = await searchShows(query);

  populateShows(shows);
});

async function getEpisodes(id) {
  let response = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
  let showEpisodes = response.data.map((episode) => ({
    id: episode.id,
    name: episode.name,
    season: episode.season,
    number: episode.number,
  }));
  return showEpisodes;
}

function populateEpisodes(episodes) {
  const $episodeList = $('#episodes-list');
  $episodeList.empty();
  for (let episode of episodes) {
    let $ep = $(`
    <li>${episode.name} (season ${episode.season}, number ${episode.number})</li>
    `);
    $episodeList.append($ep);
  }
  $('#episodes-area').show();
}

$('#shows-list').on('click', '#showEpisodes', async function (event) {
  event.preventDefault();
  let showId = $(event.target).closest('.Show').data('show-id');
  let episodes = await getEpisodes(showId);
  populateEpisodes(episodes);
});
