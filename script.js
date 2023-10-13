const storageSelected = document.querySelector('.storage_selected')
storageSelected.addEventListener('change', e => updateTable())
const wrapper = document.querySelector('.wrapper')

const inputForm = document.createElement('div')
inputForm.className = 'input_form'

const labelKey = document.createElement('label')
labelKey.innerText = 'Ключ'
const keyInput = document.createElement('input')
keyInput.type = 'text'
keyInput.name = 'key'
labelKey.append(keyInput)

const labelValue = document.createElement('label')
labelValue.innerText = 'Значение'
const valueInput = document.createElement('input')
valueInput.type = 'text'
valueInput.name = 'value'
labelValue.append(valueInput)

addNewItem = document.createElement('button')
addNewItem.innerText = 'Добавить в хранилище'
addNewItem.className = 'add_button'

addNewItem.addEventListener('click', e => {
  if (keyInput.value) {
    currentStorage().setItem(keyInput.value, valueInput.value)
    keyInput.value = ''
    valueInput.value = ''
    updateTable()
  }
})

const clearButton = document.createElement('button')
clearButton.innerText = 'Очистить хранилище';
clearButton.className = 'clear_button'
clearButton.addEventListener('click', (e) => clearStorage())

const table = document.createElement('table')

wrapper.append(inputForm, document.createElement('hr'), table)
inputForm.append(labelKey, labelValue, addNewItem)

function catchValue(e, recipient) {
  recipient.value = e.target.innerText
}

function createRow(count, key, value) {
  const newRow = document.createElement('tr')
  const counter = document.createElement('td')
  counter.innerText = `${count}.`
  counter.className = 'count_field'
  const keyField = document.createElement('td')
  keyField.addEventListener('click', (e) => catchValue(e, keyInput))
  keyField.innerText = key
  keyField.className = 'key_field'

  const valueField = document.createElement('td')
  valueField.innerText = value
  valueField.addEventListener('click', (e) => catchValue(e, valueInput))
  valueField.className = 'value_field'


  const deleteField = document.createElement('td')
  const deleteButton = document.createElement('span')
  deleteButton.className = 'delete_button'
  deleteButton.innerText = 'X'
  deleteButton.addEventListener('click', e => deleteItem(e))
  deleteField.append(deleteButton)
  deleteField.className = 'delete_field'
  newRow.append(counter, keyField, valueField, deleteField)
  return newRow
}

function currentStorage() {
  const storage = storageSelected.value == 'sessionStorage' ? sessionStorage : localStorage;
  if (clearButton) clearButton.remove()
  return storage
}

function deleteItem(event, storage) {
  if (confirm('Вы действительно хотите удалить эту запись?')){
    currentStorage().removeItem(event.target.parentNode.parentNode.cells[1].innerText)
    updateTable()
  }
}
function clearStorage() {
  if (confirm('Вы уверены, что хотите полностью очистить локальное хранилище?')){
    currentStorage().clear()
    clearButton.remove()
    updateTable()
  } 
}
function updateTable() {
  table.innerHTML = ''
  if (typeof(currentStorage()) === 'undefined'){
    stopMessage = document.createElement('h2')
    stopMessage.innerText = 'Ваш браузер не поддерживает хранилища'
    wrapper.append(stopMessage)
    return
  }

  const tableHeader = document.createElement('thead')
  const headerRow = document.createElement('tr')
  headerRow.innerHTML = `<th>№пп</th>
                         <th>Ключ</th> 
                         <th>Значение</th>
                         <th>Удалить</th>`
  tableHeader.append(headerRow)
  table.append(tableHeader)

  if (currentStorage().length > 0) {
      const tableContent = document.createElement('tbody')
    for (let i = 0; i < currentStorage().length; i++) {
      tableContent.append(createRow(i + 1, currentStorage().key(i), currentStorage().getItem(currentStorage().key(i))))
    }
    table.append(tableContent)
    wrapper.append(clearButton);
  }
}
updateTable()