import { $, http, submitFormEvent } from './utils.js'

async function updateAppList() {
  $('#applicationList').innerHTML = `<p>Loading</p>`

  const results = await http.get('/api/application')

  const list = results._embedded.applications.map(app => {
    const { id, name } = app
    return `<li>
      <form data-form="editApp" action="/api/application/${id}/put" method="POST">
        <label>Name</label>
        <input id="edit-${id}" value="${name}">
        <button type="submit">Edit</button>
      </form>

      <form data-form="deleteApp" action="/api/application/${id}/delete" method="POST">
        <button type="submit">Delete</button>
      </form>
    </li>`
  })

  let html = '<p>No items</p>'
  if (list.length) {
    html = `<ul>${list}</ul>`
  }

  $('#applicationList').innerHTML = html
}

window.addEventListener('submit', async (event) => {
  try {
    let results
    switch(event.target.dataset.event) {
      case 'getBalance':
        results = await submitFormEvent(event)
        event.target.insertAdjacentHTML('beforeend', `<p>Account balance: € ${results.data.data.value}</p>`)
        event.target.reset()
        break;

      case 'getApps':
        event.preventDefault()
        updateAppList()
        break;

      case 'editApp':
        results = await submitFormEvent(event)
        console.log(results)
        updateAppList()
        break;

      case 'deleteApp':
        await submitFormEvent(event)
        updateAppList()
        break;
    }
  } catch(error) {
    // TODO:
    console.log(error)
  }
})
