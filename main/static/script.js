class HRTranslator {
  constructor() {
    this.displayedPairs = []
    this.loading = false
    this.hasMore = true
    this.currentPage = 1 // Start with page 1
    this.likedPairs = new Set()
    // this.postsPerLoad is now determined by the backend (JOKES_PER_PAGE)

    this.postsContainer = document.getElementById("posts-container")
    this.loadingElement = document.getElementById("loading")
    this.endMessageElement = document.getElementById("end-message")

    // Share Modal Elements
    this.shareModal = document.getElementById("share-modal");
    this.closeModalBtn = this.shareModal.querySelector(".close-button");
    this.shareTextElement = this.shareModal.querySelector("#share-text");
    this.shareUrlInput = this.shareModal.querySelector("#share-url");
    this.copyLinkBtn = this.shareModal.querySelector("#copy-link-btn");
    this.twitterShareLink = this.shareModal.querySelector("#share-twitter");
    this.facebookShareLink = this.shareModal.querySelector("#share-facebook");
    this.redditShareLink = this.shareModal.querySelector("#share-reddit");

    this.init()
  }

  init() {
    this.loadLikedPairsFromStorage();
    this.loadMorePairs();
    this.setupScrollListener();
    this.setupShareModalListeners();
  }

  loadMorePairs() {
    if (this.loading || !this.hasMore) return

    this.loading = true
    this.showLoading()

    fetch(`/get_jokes_page/${this.currentPage}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(nextPairs => {
        if (nextPairs.length === 0) {
          this.hasMore = false;
          this.showEndMessage();
        } else {
          nextPairs.forEach((pair) => {
            // Ensure displayedPairs doesn't grow indefinitely if not needed for other logic
            // For now, keeping original behavior of appending
            this.displayedPairs.push(pair); 
            this.renderPost(pair);
          });
          this.currentPage++; // Increment page number for the next fetch
        }
      })
      .catch(error => {
        console.error("Failed to load more pairs:", error);
        // Optionally, show an error message to the user
        this.hasMore = false; // Stop trying to load more if an error occurs
        this.showEndMessage(); // Or a specific error message element
      })
      .finally(() => {
        this.loading = false;
        this.hideLoading();
      });
  }

  renderPost(pair) {
    const postElement = document.createElement("article")
    postElement.className = "post"
    postElement.innerHTML = `
            <div class="real-thought">
                <h2>"${pair.realThought}"</h2>
            </div>
            
            <div class="divider">
                <div class="divider-line"></div>
                <div class="divider-text">HR APPROVED</div>
                <div class="divider-line"></div>
            </div>
            
            <div class="hr-version">
                <p>"${pair.hrVersion}"</p>
            </div>
            
            <div class="actions">
                <div class="action-buttons">
                    <button class="action-btn like-btn" data-id="${pair.id}">
                        <svg class="icon heart-icon" viewBox="0 0 24 24">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                        <span class="like-count">${pair.like_count || 0}</span>
                    </button>
                    
                    <button class="action-btn share-btn">
                        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13"></path>
                        </svg>
                        <span>Share</span>
                    </button>
                </div>
                
                <div class="post-number">#${pair.id}</div>
            </div>
        `

    // Add like functionality
    const likeBtn = postElement.querySelector(".like-btn");
    if (this.likedPairs.has(pair.id)) {
        likeBtn.classList.add("liked");
    }
    likeBtn.addEventListener("click", () => this.toggleLike(pair.id, likeBtn));

    // Add share functionality
    const shareBtn = postElement.querySelector(".share-btn");
    shareBtn.addEventListener("click", () => this.handleShare(pair));

    this.postsContainer.appendChild(postElement)
  }

  toggleLike(pairId, buttonElement) {
    const likeCountElement = buttonElement.querySelector(".like-count");
    let currentCount = Number.parseInt(likeCountElement.textContent);

    if (this.likedPairs.has(pairId)) {
      // User is unliking the post
      this.likedPairs.delete(pairId);
      localStorage.removeItem(`liked_post_${pairId}`);
      buttonElement.classList.remove("liked");
      // For simplicity, we don't send an "unlike" request to the server.
      // The count will be corrected on next page load if it was already liked.
      // We can decrement visually for immediate feedback.
      likeCountElement.textContent = currentCount > 0 ? currentCount - 1 : 0;

    } else {
      // User is liking the post
      this.likedPairs.add(pairId);
      localStorage.setItem(`liked_post_${pairId}`, 'true');
      buttonElement.classList.add("liked");
      
      // Visually increment immediately
      likeCountElement.textContent = currentCount + 1;

      // Send like to the server
      fetch(`/like/${pairId}`, { method: 'POST' })
        .then(response => response.json())
        .then(data => {
          // Update the count with the authoritative value from the server
          if (data && typeof data.like_count !== 'undefined') {
            likeCountElement.textContent = data.like_count;
          }
        })
        .catch(error => {
          console.error('Error liking post:', error);
          // Revert visual change if server update fails
          likeCountElement.textContent = currentCount; 
          this.likedPairs.delete(pairId);
          localStorage.removeItem(`liked_post_${pairId}`);
          buttonElement.classList.remove("liked");
        });
    }
  }

  setupScrollListener() {
    window.addEventListener("scroll", () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000) {
        this.loadMorePairs()
      }
    })
  }

  showLoading() {
    this.loadingElement.classList.remove("hidden")
  }

  hideLoading() {
    this.loadingElement.classList.add("hidden")
  }

  showEndMessage() {
    this.endMessageElement.classList.remove("hidden")
  }

  getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  // --- Share Functionality ---

  setupShareModalListeners() {
    this.closeModalBtn.addEventListener("click", () => this.hideShareModal());
    window.addEventListener("click", (event) => {
      if (event.target == this.shareModal) {
        this.hideShareModal();
      }
    });
    this.copyLinkBtn.addEventListener("click", () => {
      this.shareUrlInput.select();
      navigator.clipboard.writeText(this.shareUrlInput.value).then(() => {
        this.copyLinkBtn.textContent = "Copied!";
        setTimeout(() => { this.copyLinkBtn.textContent = "Copy Link"; }, 2000);
      });
    });
  }

  showShareModal() {
    this.shareModal.classList.remove("hidden");
  }

  hideShareModal() {
    this.shareModal.classList.add("hidden");
  }

  handleShare(pair) {
    const text = `Real Thought: "${pair.realThought}"\nHR Version: "${pair.hrVersion}"`;
    const url = window.location.href;
    
    this.shareTextElement.textContent = text;
    this.shareUrlInput.value = url;

    const encodedUrl = encodeURIComponent(url);
    const encodedText = encodeURIComponent(text);

    this.twitterShareLink.href = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
    this.facebookShareLink.href = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
    this.redditShareLink.href = `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedText}`;
    
    this.showShareModal();
  }

  loadLikedPairsFromStorage() {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('liked_post_')) {
        const pairId = parseInt(key.replace('liked_post_', ''), 10);
        if (!isNaN(pairId)) {
          this.likedPairs.add(pairId);
        }
      }
    }
  }
}

// Initialize the app when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new HRTranslator()
})
