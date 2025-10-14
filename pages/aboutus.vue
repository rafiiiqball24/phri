<template>
    <section class="about">
        <header class="hero">
            <div class="hero__left">
                <div class="hero__overlay">
                    <p class="hero__meta">TENTANG KAMI</p>
                    <h1 class="hero__title">
                        PHRI Shop
                        <span class="hero__underline"></span>
                    </h1>
                    <p class="hero__subtitle">
                        Building a Beneficial Ecosystem Together
                    </p>
                </div>
            </div>
            <figure class="hero__right">
                <img src="/images/shop/aboutus.webp" alt="Etalase PHRI Shop" />
            </figure>
        </header>

        <section class="intro container">
            <div class="intro__copy">
                <h2 class="intro__title">What is PHRI Shop?</h2>
                <p class="intro__desc">
                    PHRI Shop is more than just a marketplace—it's a community-driven platform designed to create
                    mutual benefits for all its members. We connect buyers and sellers in a trusted ecosystem that
                    prioritizes transparency, fairness, and shared prosperity.
                </p>
                <p class="intro__desc">
                    Through innovative features and member-centric policies, we're building a sustainable economic
                    platform where every transaction contributes to the collective growth and welfare of our community.
                </p>

                <div class="intro__badges">
                    <div class="badge">
                        <img class="badge__ico" src="/Icons/store.svg" alt="" />
                        <span class="badge__text">Trusted Marketplace</span>
                    </div>
                    <div class="badge">
                        <img class="badge__ico" src="/Icons/community.svg" alt="" />
                        <span class="badge__text">Community Focus</span>
                    </div>
                    <div class="badge">
                        <img class="badge__ico" src="/Icons/trendup.svg" alt="" />
                        <span class="badge__text">Shared Growth</span>
                    </div>
                </div>
            </div>

            <figure class="intro__media card">
                <img src="/images/shop/aboutus2.webp" alt="Team collaboration" />
            </figure>
        </section>

        <section class="vm">
            <div class="container">
                <h3 class="vm__heading">Our Vision & Mission</h3>
                <p class="vm__sub">
                    Guiding principles that drive our commitment to creating lasting value for our community.
                </p>

                <div class="vm__grid">
                    <div class="vm__card">
                        <div class="vm__icon">
                            <img src="/Icons/vision.svg" alt="" />
                        </div>
                        <div class="vm__body">
                            <h4 class="vm__title">Our Vision</h4>
                            <p class="vm__text">
                                To become an independent economic platform that improves the welfare of its members
                                through sustainable growth, innovation, and community empowerment.
                            </p>
                        </div>
                    </div>

                    <div class="vm__card">
                        <div class="vm__icon">
                            <img src="/Icons/mission.svg" alt="" />
                        </div>
                        <div class="vm__body">
                            <h4 class="vm__title">Our Mission</h4>
                            <p class="vm__text">
                                To provide a transparent, accessible, and member-focused marketplace that creates
                                opportunities for economic participation, fosters trust, and delivers shared prosperity
                                to all stakeholders.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="values">
            <div class="container">
                <h3 class="values__heading">Our Core Values</h3>
                <p class="values__sub">The fundamental principles that shape our culture and guide our actions.</p>

                <div class="values__grid">
                    <div class="val card">
                        <div class="val__ico"><img src="/Icons/integrity.svg" alt="" /></div>
                        <h4 class="val__title">Integrity</h4>
                        <p class="val__text">
                            We operate with transparency and honesty in every transaction and interaction.
                        </p>
                    </div>

                    <div class="val card">
                        <div class="val__ico"><img src="/Icons/heart.svg" alt="" /></div>
                        <h4 class="val__title">Community First</h4>
                        <p class="val__text">
                            Our members are at the heart of everything we do, driving our decisions and innovations.
                        </p>
                    </div>

                    <div class="val card">
                        <div class="val__ico"><img src="/Icons/inovation.svg" alt="" /></div>
                        <h4 class="val__title">Innovation</h4>
                        <p class="val__text">
                            We continuously evolve and adapt to meet the changing needs of our marketplace.
                        </p>
                    </div>

                    <div class="val card">
                        <div class="val__ico"><img src="/Icons/trust.svg" alt="" /></div>
                        <h4 class="val__title">Trust</h4>
                        <p class="val__text">
                            Building lasting relationships through reliable service and consistent quality.
                        </p>
                    </div>

                    <div class="val card">
                        <div class="val__ico"><img src="/Icons/excelence.svg" alt="" /></div>
                        <h4 class="val__title">Excellence</h4>
                        <p class="val__text">
                            We strive for the highest standards in every aspect of our platform and service.
                        </p>
                    </div>

                    <div class="val card">
                        <div class="val__ico"><img src="/Icons/shared.svg" alt="" /></div>
                        <h4 class="val__title">Shared Prosperity</h4>
                        <p class="val__text">
                            Creating value that benefits all members of our ecosystem equally.
                        </p>
                    </div>
                </div>
            </div>
        </section>


    </section>
</template>

<script setup lang="ts">
const toTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
useHead({
    title: 'About Us'
})
</script>

<style scoped>
html,
body {
    margin: 0;
    padding: 0;
    overflow-x: hidden;
}

:root {
    --ink: #0A0A0A;
    --sub: #6B7280;
    --bg: #FDFAED;
    --line: #EAEAEA;
    --card: #FFFFFF;
}


.hero {
    display: grid;
    grid-template-columns: 1fr 1fr;
    height: 100vh;
    overflow: hidden;
    gap: 0;
    /* <-- pastikan tidak ada jarak */
}


.hero__left {
    position: relative;
    background: url("/images/shop/aboutus3.webp") center/cover no-repeat;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
}

.hero__overlay {
    color: #fff;
    padding-left: 5rem;
    max-width: 500px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
}

.hero__meta {
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 0.75rem;
    opacity: 0.9;
}

.hero__title {
    font-size: 3rem;
    font-weight: 600;
    margin: 0 0 1rem;
    position: relative;
}

.hero__underline {
    display: block;
    width: 60px;
    height: 3px;
    background: #fff;
    border-radius: 2px;
    margin-top: 10px;
}

.hero__subtitle {
    font-size: 1.25rem;
    font-weight: 400;
    line-height: 1.6;
    max-width: 380px;
}

.hero__right {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    /* center vertikal */
    justify-content: center;
    /* center horizontal */
    background: #fff;
    /* ganti sesuai tema jika perlu */
}

.hero__right img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    /* <-- tidak akan crop */
    object-position: center;
    display: block;
}

@media (max-width: 1024px) {
    .hero {
        grid-template-columns: 1fr;
        height: auto;
    }

    .hero__left img,
    .hero__right img {
        height: 420px;
    }
}


.container {
    width: min(1100px, 92%);
    margin-inline: auto
}

.intro {
    display: grid;
    grid-template-columns: 1.05fr 1fr;
    gap: 40px;
    align-items: center;
    padding-block: 72px
}

@media(max-width:1024px) {
    .intro {
        grid-template-columns: 1fr
    }
}

.intro__title {
    font-size: 18px;
    font-weight: 700;
    margin: 0 0 12px
}

.intro__desc {
    color: var(--sub);
    line-height: 1.75;
    margin: 0 0 14px
}

.intro__badges {
    display: flex;
    gap: 14px;
    margin-top: 18px;
    flex-wrap: wrap
}

.badge {
    display: flex;
    align-items: center;
    gap: 10px;
    background: #F3F4F6;
    border: 1px solid var(--line);
    border-radius: 999px;
    padding: 8px 12px
}

.badge__ico {
    width: 18px;
    height: 18px
}

.badge__text {
    font-size: 14px
}

.card {
    background: var(--card);
    border: 1px solid var(--line);
    border-radius: 18px;
    box-shadow: 0 6px 20px rgba(10, 10, 10, .04)
}

.card img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 16px
}

.vm {
    background: #F9FAFB;
    padding-block: 64px
}

.vm__heading {
    text-align: center;
    margin: 0 0 6px;
    font-size: 20px;
    font-weight: 700
}

.vm__sub {
    text-align: center;
    color: var(--sub);
    margin: 0 0 28px
}

.vm__grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 18px
}

@media(max-width:900px) {
    .vm__grid {
        grid-template-columns: 1fr
    }
}

.vm__card {
    display: flex;
    gap: 14px;
    background: #fff;
    border: 1px solid var(--line);
    border-radius: 16px;
    padding: 18px
}

.vm__icon {
    flex: 0 0 40px;
    height: 40px;
    display: grid;
    place-items: center;
    border-radius: 10px;
    background: #FFF7ED
}

.vm__icon img {
    width: 20px;
    height: 20px
}

.vm__title {
    margin: 2px 0 6px;
    font-size: 16px;
    font-weight: 700
}

.vm__text {
    margin: 0;
    color: var(--sub);
    line-height: 1.65
}

.values {
    padding-block: 56px
}

.values__heading {
    text-align: center;
    margin: 0 0 6px;
    font-size: 20px;
    font-weight: 700
}

.values__sub {
    text-align: center;
    color: var(--sub);
    margin: 0 0 26px
}

.values__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px
}

@media(max-width:1024px) {
    .values__grid {
        grid-template-columns: repeat(2, 1fr)
    }
}

@media(max-width:640px) {
    .values__grid {
        grid-template-columns: 1fr
    }
}

.val {
    padding: 18px;
    border-radius: 16px;
    border: 1px solid var(--line);
    background: #fff
}

.val__ico {
    width: 40px;
    height: 40px;
    display: grid;
    place-items: center;
    background: #F3F4F6;
    margin-bottom: 10px;
    border-radius: 8px;
    padding: 4px;
}

.val__ico img {
    width: 100%;
    height: 100%;
    max-width: 22px;
    max-height: 22px;
    object-fit: contain;
}


.val__title {
    font-size: 16px;
    font-weight: 700;
    margin: 0 0 6px
}

.val__text {
    margin: 0;
    color: var(--sub);
    line-height: 1.65
}

.cta {
    background: linear-gradient(180deg, var(--bg), #FFEBD3);
    padding-top: 28px;
    border-top-left-radius: 28px;
    border-top-right-radius: 28px
}

.cta__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px
}

@media(max-width:700px) {
    .cta__row {
        flex-direction: column;
        align-items: flex-start
    }
}

.cta__label {
    font-weight: 600
}

.cta__socials {
    display: flex;
    gap: 12px
}

.cta__socials a img {
    width: 20px;
    height: 20px
}

.cta__top {
    background: #fff;
    border: 1px solid var(--line);
    border-radius: 999px;
    padding: 10px 14px;
    cursor: pointer
}

.cta__meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    border-top: 1px dashed #E6E6E6;
    margin-top: 18px;
    padding: 16px 0 26px
}

.cta__link {
    color: var(--ink);
    text-decoration: underline
}
</style>
