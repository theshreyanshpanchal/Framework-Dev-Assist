document.addEventListener('DOMContentLoaded', () => {
    const commandList = document.getElementById('command-list');
    const searchContainer = document.getElementById('search-container');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const resetBtn = document.getElementById('reset-btn');
    const subTabs = document.querySelectorAll('.sub-tab');
    let activeSubTab = 'commands'; // Default active sub-tab

    function loadCommands(filter = '') {
        const jsonFile = activeSubTab === 'commands' ? 'docs/commands.json' : 'docs/methods.json';

        fetch(jsonFile)
            .then(response => response.json())
            .then(commands => {
                commandList.innerHTML = '';
                commands.forEach(command => {
                    if (command.name.toLowerCase().includes(filter) || command.description.toLowerCase().includes(filter)) {
                        const li = document.createElement('li');
                        li.className = 'command-item';

                        const name = document.createElement('div');
                        name.className = 'command-name';
                        name.textContent = command.name;

                        const copyBtn = document.createElement('button');
                        copyBtn.className = 'copy-btn';
                        copyBtn.innerHTML = 'Copy <img src="icons/system/copy.png" alt="Copy Icon">';
                        copyBtn.addEventListener('click', () => {
                            navigator.clipboard.writeText(command.name)
                                .then(() => showCopied(copyBtn))
                                .catch(err => console.error('Failed to copy command:', err));
                        });

                        name.appendChild(copyBtn);

                        const description = document.createElement('div');
                        description.className = 'command-description';
                        description.textContent = command.description;

                        li.appendChild(name);
                        li.appendChild(description);

                        if (command.options && command.options.length > 0) {
                            const toggleBtn = document.createElement('button');
                            toggleBtn.className = 'toggle-btn';
                            toggleBtn.innerHTML = '<img src="icons/system/options.png" alt="Options Icon"> Show Options <img src="icons/system/down.png" alt="Options Icon">';

                            const optionsList = document.createElement('ul');
                            optionsList.className = 'command-options';
                            optionsList.style.display = 'none';

                            toggleBtn.addEventListener('click', () => {
                                const isHidden = optionsList.style.display === 'none';
                                optionsList.style.display = isHidden ? 'block' : 'none';
                                toggleBtn.innerHTML = isHidden ? '<img src="icons/system/options.png" alt="Options Icon"> Hide Options <img src="icons/system/up.png" alt="Options Icon">' : '<img src="icons/system/options.png" alt="Options Icon"> Show Options <img src="icons/system/down.png" alt="Options Icon">';
                            });

                            command.options.forEach(option => {
                                const optionLi = document.createElement('li');
                                optionLi.className = 'command-item';

                                const optionName = document.createElement('div');
                                optionName.className = 'command-name';
                                optionName.textContent = `${command.name} ${option.shortcut}`;

                                const optionCopyBtn = document.createElement('button');
                                optionCopyBtn.className = 'copy-btn';
                                optionCopyBtn.innerHTML = 'Copy <img src="icons/system/copy.png" alt="Copy Icon">';
                                optionCopyBtn.addEventListener('click', () => {
                                    navigator.clipboard.writeText(`${command.name} ${option.shortcut}`)
                                        .then(() => showCopied(optionCopyBtn))
                                        .catch(err => console.error('Failed to copy option:', err));
                                });

                                optionName.appendChild(optionCopyBtn);

                                const optionDescription = document.createElement('div');
                                optionDescription.className = 'command-description';
                                optionDescription.textContent = option.description;

                                optionLi.appendChild(optionName);
                                optionLi.appendChild(optionDescription);
                                optionsList.appendChild(optionLi);
                            });

                            li.appendChild(toggleBtn);
                            li.appendChild(optionsList);
                        }

                        commandList.appendChild(li);
                    }
                });
            })
            .catch(error => console.error('Error loading commands:', error));
    }

    function showCopied(button) {
        const originalText = button.innerHTML;
        button.innerHTML = 'Copied!';
        setTimeout(() => {
            button.innerHTML = originalText;
        }, 2000);
    }

    document.getElementById('close-btn').addEventListener('click', () => {
        window.close();
    });

    subTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            subTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            activeSubTab = tab.getAttribute('data-type');
            loadCommands(); // Reload commands based on the active sub-tab
        });
    });

    searchBtn.addEventListener('click', () => {
        if (searchContainer.style.display === 'none' || searchContainer.style.display === '') {
            searchContainer.style.display = 'block';
            searchInput.focus();
        } else {
            searchContainer.style.display = 'none';
            searchInput.value = '';
            loadCommands();
        }
    });

    searchInput.addEventListener('input', (e) => {
        const filter = e.target.value.toLowerCase();
        loadCommands(filter);
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const filter = e.target.value.toLowerCase();
            loadCommands(filter);
        }
    });

    resetBtn.addEventListener('click', () => {
        searchContainer.style.display = 'none';
        searchInput.value = '';
        loadCommands();
    });

    loadCommands(); // Load commands for the default active sub-tab

    document.querySelectorAll('.inactive-tab').forEach(tab => {
        tab.style.pointerEvents = 'none';
        tab.style.filter = 'blur(2px)';
    });
});
