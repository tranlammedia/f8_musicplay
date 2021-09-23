/**
 * 1. Render songs
 * 2. scroll top
 * 3. play / pause / seek
 * 4. CD rorate
 * 5. next / prev
 * 6. Random
 * 7. Next / Repeat ended
 * 8. active song
 * 9. Scroll active song into view ??
 * 10. click song to play
 */
const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = 'F8_PLAYER';

const player = $('.player')
const heading = $('header h2');
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBth = $('.btn-toggle-play')
const repeatBth = $('.btn-repeat')
const prevBth = $('.btn-prev')
const nextBth = $('.btn-next')
const randomBth = $('.btn-random')
const progress = $('#progress')
const playlist = $('.playlist')


const app = {
    currentIndex:0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    song: [
        {
            name: 'Take Me To Your Heart',
            singer: 'Michael Learns To Rock',
            path:'./assets/music/Take_Me_To_Your_Heart.mp3',
            image: './assets/img/Take_Me_To_Your_Heart.jpg'
        },
        {
            name: 'Bài Này Chill Phết',
            singer: 'Đen & Min',
            path: './assets/music/Bai_Nay_Chill_Phet.mp3',
            image: './assets/img/Bai_Nay_Chill_Phet.jpg'
        },
        {
            name: 'When You\'re Gone',
            singer: 'Avril Lavigne',
            path:'./assets/music/When_You_re_Gone.mp3',
            image: './assets/img/When_You_re_Gone.jpg'
        },
        {
            name: 'Lonely',
            singer: 'Akon',
            path: './assets/music/Lonely.mp3',
            image: './assets/img/Lonely.jpg',
        },
        {
            name: 'Tiểu Thuyết Tình Yêu',
            singer: 'ft Andree ft Lee',
            path:'./assets/music/Tieu_Thuyet_Tinh_Yeu.mp3',
            image: './assets/img/Tieu_Thuyet_Tinh_Yeu.jpg'
        },
        {
            name: 'Thằng Tàu Lai',
            singer: 'Jimmy Nguyễn',
            path:'./assets/music/Thang_Tau_Lai.mp3',
            image: './assets/img/Thang_Tau_Lai.jpeg'
        },
        {
            name: 'Ma Ya Hi',
            singer: 'Jimmy Nguyễn',
            path:'./assets/music/Ma_Ya_Hi.mp3',
            image: './assets/img/Ma_Ya_Hi.jpeg'
        }
    ],
    setConfig: function(key, value){
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
        
    },
    render: function(){
        const htmls = this.song.map(function(song, index){
            return `
                <div class="song" data-index="${index}">
                    <div class="thumb" style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        $('.playlist').innerHTML = htmls.join('')
        const listSongs = $$('.playlist .song')
        return listSongs
    },

    defineProperties: function(){
        Object.defineProperty(app, 'currentSong', {
            get: function() {
                return this.song[this.currentIndex]
            }
        })
    },

    handleEvent: function(){
        const _this = this;
        const cdHeight = $('.cd').offsetHeight

        // CD quay
        const cdRorate = cdThumb.animate({transform: 'rotate(360deg)'},{
            duration: 10000,
            iterations: Infinity}
            )
        

        cdRorate.pause()
        //xu ly zoom CD
        document.onscroll = function(){
            var scrollY = window.scrollY || document.documentElement.scrollTop;
            var newHeight = cdHeight - scrollY;
            $('.cd').style.width = newHeight > 0 ? newHeight + 'px' : 0
            $('.cd').style.opacity = newHeight > 0 ? newHeight / cdHeight : 0
        }
        


        //Xu ly khi click play
        playBth.onclick = function(){
            if (_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()  
            }          
        }
        // khi song duoc play
        audio.onplay = function(){
            player.classList.add('playing')
            _this.isPlaying = true
            cdRorate.play()
            _this.activeSong()
        }
        // khi song duoc pause
        audio.onpause = function(){
            player.classList.remove('playing');
            _this.isPlaying = false
            cdRorate.pause()
        }

        // Khi song dang play
        audio.ontimeupdate = function(){
            if(audio.currentTime) {
                progress.value = audio.currentTime/audio.duration * 100
            }
        }
        // tua song
        progress.onchange = function(e){
            // tong thoi gian bai hang * % progress.value / 100
            const seek = audio.duration * e.target.value / 100
            audio.currentTime = seek
        }
        // next song
        nextBth.onclick = function(){
            _this.nextSong()
            audio.play()
        }
        // prev song
        prevBth.onclick = function(){
            _this.prevSong()
            audio.play()
        }
        // random
        randomBth.onclick = function(){
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom)
            randomBth.classList.toggle('active')
        }
        // khi song ended
        audio.onended = function(){
            if (_this.isRepeat) {
                _this.repeatSong()
            } else {
                _this.nextSong()
                audio.play()

            }
        }
        //repeat
        repeatBth.onclick = function(){
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBth.classList.toggle('active')
        }

        //Lang nghe hanh vi click vao playlist
        playlist.onclick = function(e){
            const clickSong = e.target.closest('.song:not(.active)')
            if(e.target.classList.value == 'fas fa-ellipsis-h'){
                alert('dang cap nhat')
            } else if (clickSong) {
                _this.currentIndex =  clickSong.getAttribute('data-index')
                _this.loadCurrentSong();
                audio.play()
            }
        }
    },

    loadCurrentSong: function(){
        heading.innerHTML = this.currentSong.name
        cdThumb.style = `background-image: url('${this.currentSong.image}')`
        audio.src = `${this.currentSong.path}`
    },
    loadConfig: function(){
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat

        randomBth.classList.toggle('active', this.isRandom)
        repeatBth.classList.toggle('active', this.isRepeat)
    },

    // active song dang play
    activeSong: function(){
        const listSongs = app.render()
        listSongs[this.currentIndex].classList.add('active')
    },
    

    nextSong: function(){
        if(this.isRandom) {
            this.randomSong()
        } else {
            this.currentIndex++
            // console.log(this.currentIndex)
            if (this.currentIndex >= this.song.length) {
                this.currentIndex = 0;
            }

        }
        this.loadCurrentSong()
    },
    prevSong: function(){
        if(this.isRandom) {
            this.randomSong()
        } else {
            this.currentIndex--
            // console.log(this.currentIndex)
            if (this.currentIndex < 0) {
                this.currentIndex = this.song.length - 1;
            }
        }
        this.loadCurrentSong()
    },
    randomSong: function(){
        const random = Math.random() * this.song.length
        const randomSong = Math.floor(random)
        // xu ly khi random lai dung bai hien tai
        if(randomSong !== this.currentIndex) {
            this.currentIndex = randomSong
        } else {
            this.randomSong()
            console.log(randomSong)
        }
        this.loadCurrentSong()
    },  
    repeatSong: function(){
        audio.play()
    },
    start: function(){
        //load cau hinh ban dau
        this.loadConfig()
        
        // Dinh nghia cac thuoc tinh cho obj
        this.defineProperties();

        //lang nghe cac event
        this.handleEvent();

        // load bai hat dau tien vao UI khic hay ung dung
        this.loadCurrentSong();

        // render danh sach bai hat
        this.render();
        // console.log(app.currentSong)
    }
}

app.start()
// console.log($('.cd').offsetWidth)
