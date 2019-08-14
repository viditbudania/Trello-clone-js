let key = "";
let token = "";
let boardId = "";
let boardIdList = "";


function refresh() {
    fetch(`https://api.trello.com/1/boards/${boardId}?actions=all&boardStars=none&cards=none&card_pluginData=false&checklists=none&customFields=false&fields=name%2Cdesc%2CdescData%2Cclosed%2CidOrganization%2Cpinned%2Curl%2CshortUrl%2Cprefs%2ClabelNames&lists=open&members=none&memberships=none&membersInvited=none&membersInvited_fields=all&pluginData=false&organization=false&organization_pluginData=false&myPrefs=false&tags=false&key=${key}&token=${token}`).then((boardData) => {
        return boardData.json()
    }).then((boardData) => {
        boardName(boardData)
    });

    fetch(`https://api.trello.com/1/boards/${boardId}/cards/?key=${key}&token=${token}`)
        .then((res) => {
            return res.json()
        }).then((cardData) => {
            console.log(cardData)
            loadCard(cardData)
        })
}
refresh();


function boardName(boardData) {
    let cardName = document.getElementById("input-content");
    let span = document.createElement('span')
    let name = document.createTextNode(boardData['lists'][2]['name']);
    span.appendChild(name);
    cardName.appendChild(span);
}

function deletingNode(parentNode) {
    while (parentNode.firstChild) {
        parentNode.removeChild(parentNode.firstChild)
    }
}

async function cardAdd() {
    let input = document.getElementById('input').value
    document.getElementById('input').value = '';
    await fetch(`https://api.trello.com/1/cards?name=${input}&pos=bottom&idList=5d233ce8cc32b616f29ac0aa&keepFromSource=all&key=${key}&token=${token}`, {
        method: 'post'
    })
    let cardList = document.getElementById("list");
    let delteNameOfBoard = document.getElementById('input-content')
    deletingNode(delteNameOfBoard)
    deletingNode(cardList);
    refresh();
}

async function archiveCard(id) {
    await fetch(`https://api.trello.com/1/cards/${id}?closed=true&key=${key}&token=${token}`, {
        method: 'PUT'
    })
    let cardList = document.getElementById("list");
    let delteNameOfBoard = document.getElementById('input-content')
    deletingNode(delteNameOfBoard)
    deletingNode(cardList);
    refresh();
}

function loadCard(cardData) {
    let cardlist = document.getElementById("list")
    let boardCards = cardData.filter((boardCards => {
        return boardCards['idList'] == boardIdList
    }))
    console.log(boardCards)
    boardCards.forEach(card => {
        let archiveButton = document.createElement('button')
        let archiveButtonText = document.createTextNode('   ')
        archiveButton.appendChild(archiveButtonText)

        let li = document.createElement('li')
        let text = document.createTextNode(card['name'])
        li.appendChild(text)
        li.appendChild(archiveButton)
        cardlist.appendChild(li)

        li.className = "list-group-item"
        archiveButton.className = "btn-btn-outline-primary";
    });
    let btnAdd = document.getElementById('btn-add');
    btnAdd.addEventListener('click', cardAdd)
    cardlist.addEventListener('click', function () {
        if (event.target.tagName == 'BUTTON') {
            console.log(boardCards)
            let cardNode = (event.target.parentNode)
            let parentCardNode = cardNode.parentNode
            let cardIndex = Array.from(parentCardNode.children).indexOf(cardNode)
            let archiveCardId = boardCards[cardIndex]['id']
            archiveCard(archiveCardId)
        } else {
            event.stopImmediatePropagation;
            addingItemsInCard(cardlist, boardCards)
        }
    }, false)
}

function addingItemsInCard(cardList, boardCards) {

    var index = Array.from(cardList.children).indexOf(event.target)
    let targetCardId = boardCards[index]['id'];
    addChecklist(targetCardId)
    let div1 = document.getElementById('pop-up')
    div1.className = 'layer2'

    let layer2Div = document.getElementById('layer1')
    layer2Div.className = 'backLayer'

    let divContainChecklist = document.createElement('div')
    div1.appendChild(divContainChecklist)

    let h1 = document.createElement('h1')
    let cardtext = document.createTextNode(event.target.innerText)
    h1.appendChild(cardtext)
    div1.appendChild(h1)

    let div2 = document.createElement('div')
    let inputbox = document.createElement('input')
    // document.getElementsByTagName('input').value = " ";
    inputbox.className = "checkList-input"
    // document.querySelector('.checkList-input').value="";
    // document.getElementsByClassName('checkList-input') = '';
    let checklistButtonAdd = document.createElement('button')
    checklistButtonAdd.className = "btn btn-outline-primary"
    let checkListButtonName = document.createTextNode('add Checklist')
    checklistButtonAdd.appendChild(checkListButtonName)
    div2.appendChild(inputbox);
    div2.appendChild(checklistButtonAdd)
    div1.appendChild(div2)

    div2.addEventListener('click', function () {

        if (event.target.tagName == 'BUTTON') {

            let checkListNAme = event.target.parentNode.children[0].value
            event.target.parentNode.children[0].value=" "
            let parentNode = document.getElementById('pop-up').children[0]
            createCheckList(targetCardId, checkListNAme, parentNode);
        }


    }, false)
}

function addChecklist(cardId) {
    fetch(`https://api.trello.com/1/cards/${cardId}/checklists?key=${key}&token=${token}`)
        .then((checklists) => {
            return checklists.json()
        })
        .then((checklists) => {
           // console.log(checklists)
            addingChecklist(checklists)
        })
}
async function createCheckList(cardId, checkListNAme, parentNode) {
    await fetch(`https://api.trello.com/1/checklists?idCard=${cardId}&name=${checkListNAme}&pos=bottom&key=${key}&token=${token}`, {
        method: 'POST'
    })
    deletingNode(parentNode)
    addChecklist(cardId)
}

function closePopup() {
    let closePopUp = document.getElementById("pop-up")
    deletingNode(closePopUp)
    closePopUp.className = "none"
    layer = document.getElementById("layer1")
    layer.className = "none"
}

function addingChecklist(checklists) {
    console.log(checklists, "mychecklist")

    let div = document.getElementById('pop-up').children[0]

    checklists.forEach(checklist => {
        //console.log(checklist, "checklist")
        let checklistId = checklist['id']
        let checklistDiv = document.createElement('div')
        
        let checkListOl = document.createElement('ol')
       
        checklistDiv.className = 'list-container'

        let ItemInput = document.createElement('input')
        ItemInput.className = "checkList-input"
        let button = document.createElement('button')
        button.className = "btn btn-outline-primary"
        let buttonText = document.createTextNode("Delete")
        let addButton = document.createElement('button')
        addButton.className = "btn btn-outline-primary"
        let addButtonText = document.createTextNode("add items")

        addButton.appendChild(addButtonText)
        
        button.appendChild(buttonText);
        let text = document.createTextNode(checklist['name'])
        checklistDiv.appendChild(text)
        checklistDiv.appendChild(checkListOl)
        checklistDiv.appendChild(ItemInput)
        
        checklistDiv.appendChild(addButton)
        checklistDiv.appendChild(button)  
            
        
        div.appendChild(checklistDiv)
       // div1.appendChild(div)
        addingItems(checklistId, checkListOl) 
    });
    div.addEventListener('click', function () {
        if (event.target.tagName == 'INPUT') {
            if (event.target.parentNode.tagName == "LI") {

                let liNode = event.target.parentNode;
                let checkListNode = event.target.parentNode.parentNode
                let parentNode = event.target.parentNode.parentNode.parentNode.children
               // console.log(event.target.parentNode.parentNode.parentNode.parentNode)
                var index = Array.from(parentNode).indexOf(checkListNode)
                let liIndex = Array.from(checkListNode.children).indexOf(liNode)
                let IdCard = (checklists[index]["idCard"])
                let itemId = checklists[index]["checkItems"][liIndex]['id']
                let status = (checklists[index]["checkItems"][liIndex]['state'])
                if (status == "incomplete") {
                    liNode.className = "status"
                    checklists[index]["checkItems"][liIndex]['state'] = 'complete'
                } else {
                    liNode.className = "status"
                    checklists[index]["checkItems"][liIndex]['state'] = 'incomplete'
                }
                let checklistnode = event.target.parentNode.parentNode.parentNode.parentNode
                updateItemlist(IdCard, itemId, status, checklists)
            }
        } else if (event.target.tagName == 'BUTTON') {
            if (event.target.innerText == 'add items') {
                itemName = event.target.parentNode.children[1].value
                event.target.parentNode.children[1].value=" ";
                let olNode = event.target.parentNode.children[0];
                //console.log(olNode)
                let checklistNode = event.target.parentNode.parentNode

                var index = Array.from(checklistNode.children).indexOf(event.target.parentNode)
                console.log(index)
                console.log(checklists)
                checklistId = checklists[index]['id']
                postItems(itemName, checklistId, olNode);
            }
            if (event.target.innerText == 'Delete') {
                if (event.target.parentNode.tagName == 'LI') {
                    let itemList = event.target.parentNode.parentNode.children
                    let itemOlNode = event.target.parentNode.parentNode
                    let checklistsNode = event.target.parentNode.parentNode.parentNode
                    let parentCheckList = event.target.parentNode.parentNode.parentNode.parentNode.children
                    let checklistIndex = Array.from(parentCheckList).indexOf(checklistsNode)
                    console.log(checklistIndex)
                    let itemToDelete = event.target.parentNode

                    let itemIndex = index = Array.from(itemList).indexOf(itemToDelete)
                    checklistId = checklists[checklistIndex]['id']
                    let itemsId = checklists[checklistIndex]['checkItems'][itemIndex]['id']
                    console.log()
                    console.log(checklistId)
                    deleteItems(checklistId, itemOlNode, itemsId)
                } else if (event.target.parentNode.tagName == 'DIV') {
                    console.log(checklists, "oldchecklist")
                    let delteCheckList = event.target.parentNode
                    let parentChecklist = event.target.parentNode.parentNode
                    console.log(parentChecklist)
                    let checklistIndex = Array.from(parentChecklist.children).indexOf(delteCheckList)
                    console.log(checklistIndex, "index")
                    let checklistId = checklists[checklistIndex]['id']
                    checklists = Array.from(checklists)
                    checklists.splice(checklistIndex, 1)
                    console.log(checklists, "new checklist")
                    deleteChecklist(checklistId, parentChecklist, checklists)
                }
            }
        }
    }, false)
}

async function updateItemlist(IdCard, itemId, status, checklists, parentNode) {
    if (status == 'incomplete') {
        await fetch(`https://api.trello.com/1/cards/${IdCard}/checkItem/${itemId}?state=complete&key=${key}&token=${token}`, {
            method: 'PUT'
        })
    } else {
        await fetch(`https://api.trello.com/1/cards/${IdCard}/checkItem/${itemId}?state=incomplete&key=${key}&token=${token}`, {
            method: 'PUT'
        })
    }
    deletingNode(parentNode)
    addingChecklist(checklists)
}

async function deleteChecklist(checklistId, parentCheckList, checklists) {
    await fetch(`https://api.trello.com/1/checklists/${checklistId}?key=${key}&token=${token}`, {
        method: 'DELETE'
    })

    deletingNode(parentCheckList)
    addingChecklist(checklists)

}
async function deleteItems(checklistId, olNode, itemsId) {
    await fetch(`https://api.trello.com/1/checklists/${checklistId}/checkItems/${itemsId}?key=${key}&token=${token}`, {
        method: 'DELETE'
    })
    deletingNode(olNode)
    addingItems(checklistId, olNode)
}

async function postItems(itemName, checklistId, parentNode) {
    await fetch(`https://api.trello.com/1/checklists/${checklistId}/checkItems?name=${itemName}&pos=bottom&checked=false&key=${key}&token=${token}`, {
        method: 'POST'
    })
    deletingNode(parentNode)
    console.log(parentNode)
    addingItems(checklistId, parentNode)
}

function addingItems(checklistId, checkListOl) {
    //console.log(checkListOl)
    fetch(`https://api.trello.com/1/checklists/${checklistId}/checkItems?key=${key}&token=${token}`)
        .then((items) => {
            return items.json()
        })
        .then((items) => {
            items.forEach(item => {
                let li = document.createElement('li')
                if (item["state"] == "complete") {
                    li.className = "status"
                }
                let button = document.createElement('button')
                button.className = "btn btn-outline-primary"
                let buttonText = document.createTextNode('Delete')
                button.appendChild(buttonText)

                let checkBox = document.createElement('input')

                checkBox.type = 'checkbox'
                let text = document.createTextNode(item['name'])
                li.appendChild(checkBox)
                li.appendChild(text)
                li.appendChild(button)
                checkListOl.appendChild(li)
            });
        })
}
