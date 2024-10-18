import { backend } from 'declarations/backend';

document.addEventListener('DOMContentLoaded', async () => {
    const shoppingList = document.getElementById('shopping-list');
    const addItemForm = document.getElementById('add-item-form');
    const newItemInput = document.getElementById('new-item');

    async function loadItems() {
        const items = await backend.getItems();
        shoppingList.innerHTML = '';
        items.forEach(item => {
            const li = createItemElement(item);
            shoppingList.appendChild(li);
        });
    }

    function createItemElement(item) {
        const li = document.createElement('li');
        li.className = `shopping-item ${item.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <input type="checkbox" ${item.completed ? 'checked' : ''}>
            <span>${item.text}</span>
            <button class="complete-btn"><i class="fas fa-check"></i></button>
            <button class="delete-btn"><i class="fas fa-trash"></i></button>
        `;

        const checkbox = li.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', async () => {
            await backend.updateItem(item.id, checkbox.checked);
            li.classList.toggle('completed');
        });

        const completeBtn = li.querySelector('.complete-btn');
        completeBtn.addEventListener('click', async () => {
            await backend.updateItem(item.id, !item.completed);
            li.classList.toggle('completed');
            checkbox.checked = !item.completed;
        });

        const deleteBtn = li.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', async () => {
            await backend.deleteItem(item.id);
            li.remove();
        });

        return li;
    }

    addItemForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const text = newItemInput.value.trim();
        if (text) {
            const id = await backend.addItem(text);
            const item = { id, text, completed: false };
            const li = createItemElement(item);
            shoppingList.appendChild(li);
            newItemInput.value = '';
        }
    });

    await loadItems();
});
