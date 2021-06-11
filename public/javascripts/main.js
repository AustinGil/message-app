import { $, http, submitFormEvent } from './utils.js'

async function updateAppList() {
  $('#applicationList').innerHTML = `<p>Loading</p>`

  const results = await http.get('/api/application')

  const list = results.data.data._embedded.applications.map(app => {
    const { id, name } = app
    return `<li>
      <form data-event="editApp" action="/api/application/${id}/put" method="POST">
        <label for="new-name-${id}">Name</label>
        <input id="new-name-${id}" name="name" value="${name}">
        <button type="submit">Edit</button>
      </form>

      <form data-event="deleteApp" action="/api/application/${id}/delete" method="POST">
        <button type="submit">Delete</button>
      </form>
    </li>`
  })

  let html = '<p>No items</p>'
  if (list.length) {
    html = `<ul>${list.join('')}</ul>`
  }

  $('#applicationList').innerHTML = html
}

window.addEventListener('submit', async (event) => {
  try {
    switch(event.target.dataset.event) {
      case 'getBalance':
        const results = await submitFormEvent(event)
        event.target.insertAdjacentHTML('beforeend', `<p>Account balance: € ${results.data.data.value}</p>`)
        event.target.reset()
        break;

      case 'getApps':
        event.preventDefault()
        updateAppList()
        break;

      case 'createApp':
      case 'editApp':
      case 'deleteApp':
        await submitFormEvent(event)
        updateAppList()
        break;

      case 'sendMessage':
        await submitFormEvent(event)
        break;
    }
  } catch(error) {
    // TODO:
    console.log(error)
  }
})
