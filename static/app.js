document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const refreshBtn = document.getElementById('refresh-btn');
    const retryBtn = document.getElementById('retry-btn');
    const spinner = document.getElementById('spinner');
    const notesList = document.getElementById('notes-list');
    const loader = document.getElementById('feed-loader');
    const errorCard = document.getElementById('error-card');
    const errorMessage = document.getElementById('error-message');
    const emptyCard = document.getElementById('empty-card');
    
    // Metadata elements
    const feedMeta = document.getElementById('feed-meta');
    const feedTitleVal = document.getElementById('feed-title-val');
    const feedUpdatedVal = document.getElementById('feed-updated-val');
    
    // Drawer elements
    const selectionDrawer = document.getElementById('selection-drawer');
    const selectedCount = document.getElementById('selected-count');
    const tweetBtn = document.getElementById('tweet-btn');
    const clearBtn = document.getElementById('clear-btn');
    
    // State
    let selectedNote = null;
    let notesData = [];

    // Initialize
    fetchNotes();

    // Event Listeners
    refreshBtn.addEventListener('click', fetchNotes);
    retryBtn.addEventListener('click', fetchNotes);
    clearBtn.addEventListener('click', clearSelection);
    
    tweetBtn.addEventListener('click', () => {
        if (!selectedNote) return;
        
        // Construct Tweet Text
        const title = selectedNote.title;
        const link = selectedNote.link;
        
        // Clean title if it contains date prefixes
        let cleanTitle = title;
        // BigQuery updates often start with dates or specific formats, let's keep them clean
        
        const tweetText = `Latest Google Cloud BigQuery Update:\n"${cleanTitle}"\n\nRead more detail here:`;
        
        // Create Twitter/X Web Intent
        const twitterIntentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(link)}&hashtags=BigQuery,GoogleCloud,DataAnalytics`;
        
        window.open(twitterIntentUrl, '_blank', 'width=550,height=420');
    });

    // Fetch notes from Flask API
    async function fetchNotes() {
        showLoader();
        clearSelection();
        
        try {
            const response = await fetch('/api/notes');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error);
            }
            
            notesData = data.notes || [];
            
            // Update metadata
            feedTitleVal.textContent = data.title || 'BigQuery Release Notes';
            feedUpdatedVal.textContent = formatDate(data.updated) || 'Just now';
            feedMeta.classList.remove('hide');
            
            renderNotes(notesData);
        } catch (error) {
            console.error('Error fetching notes:', error);
            showError(error.message);
        }
    }

    // Render release notes as cards
    function renderNotes(notes) {
        notesList.innerHTML = '';
        
        if (notes.length === 0) {
            showEmpty();
            return;
        }
        
        hideStatusCards();
        
        notes.forEach((note, index) => {
            const card = document.createElement('div');
            card.className = 'note-card glass-panel';
            // Stagger animation delay
            card.style.animationDelay = `${index * 0.05}s`;
            
            // Format single date
            const noteDate = formatDate(note.updated);
            
            card.innerHTML = `
                <div class="note-card-header">
                    <div class="card-title-area">
                        <div class="card-checkbox">
                            <i class="fa-solid fa-check"></i>
                        </div>
                        <h3 class="note-card-title">${note.title}</h3>
                    </div>
                    <span class="note-card-date">${noteDate}</span>
                </div>
                <div class="note-card-content">
                    ${note.content}
                </div>
                <div class="note-card-footer">
                    <button class="btn btn-secondary btn-sm share-card-btn" data-id="${note.id}">
                        <i class="fa-brands fa-x-twitter"></i> Share Update
                    </button>
                </div>
            `;
            
            // Event listener for selecting card
            card.addEventListener('click', (e) => {
                // If they clicked on a link inside the content, let the browser handle it
                if (e.target.tagName === 'A') return;
                
                // Toggle select
                toggleSelectCard(card, note);
            });
            
            // Event listener for direct share button
            const cardShareBtn = card.querySelector('.share-card-btn');
            cardShareBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // prevent card selection trigger
                selectCard(card, note);
                tweetBtn.click();
            });
            
            notesList.appendChild(card);
        });
    }

    // Toggle card selection
    function toggleSelectCard(cardElement, note) {
        const isSelected = cardElement.classList.contains('selected');
        
        // Clear previous selection
        document.querySelectorAll('.note-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        if (isSelected) {
            selectedNote = null;
            selectionDrawer.classList.remove('show');
        } else {
            selectedNote = note;
            cardElement.classList.add('selected');
            selectedCount.textContent = '1';
            selectionDrawer.classList.add('show');
        }
    }

    // Explicitly select card
    function selectCard(cardElement, note) {
        document.querySelectorAll('.note-card').forEach(card => {
            card.classList.remove('selected');
        });
        selectedNote = note;
        cardElement.classList.add('selected');
        selectedCount.textContent = '1';
        selectionDrawer.classList.add('show');
    }

    // Clear current selection state
    function clearSelection() {
        selectedNote = null;
        document.querySelectorAll('.note-card').forEach(card => {
            card.classList.remove('selected');
        });
        selectionDrawer.classList.remove('show');
    }

    // Date formatting helper
    function formatDate(dateString) {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return dateString;
            
            // Return format: Jun 18, 2026
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        } catch (e) {
            return dateString;
        }
    }

    // Loader visibility management
    function showLoader() {
        loader.classList.remove('hide');
        notesList.classList.add('hide');
        errorCard.classList.add('hide');
        emptyCard.classList.add('hide');
        spinner.classList.add('spinning');
        refreshBtn.disabled = true;
    }

    function hideStatusCards() {
        loader.classList.add('hide');
        notesList.classList.remove('hide');
        errorCard.classList.add('hide');
        emptyCard.classList.add('hide');
        spinner.classList.remove('spinning');
        refreshBtn.disabled = false;
    }

    function showError(msg) {
        errorMessage.textContent = msg || 'Something went wrong while fetching the BigQuery feed.';
        errorCard.classList.remove('hide');
        loader.classList.add('hide');
        notesList.classList.add('hide');
        emptyCard.classList.add('hide');
        spinner.classList.remove('spinning');
        refreshBtn.disabled = false;
    }

    function showEmpty() {
        emptyCard.classList.remove('hide');
        loader.classList.add('hide');
        notesList.classList.add('hide');
        errorCard.classList.add('hide');
        spinner.classList.remove('spinning');
        refreshBtn.disabled = false;
    }
});
