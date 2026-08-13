<template>
    <ProjectDetail full-width-images>
        <ProjectDetailHeader title="IoT Adherence Analytics for Caregivers: Dashboard Design" client="Kin Technology"
            period="2026" />

        <div class="project-hero">
            <img :src="dashboardHero" alt="Dashboard hero" width="2400" height="1352" decoding="async"
                fetchpriority="high" />
        </div>

        <div class="project-body">
            <ProjectTldrButton :summary-items="tldrSummaryItems" :markdown="tldrMarkdown" />

            <section>
                <h2>The Challenge</h2>
                <p>Kin is a healthcare startup that needed to showcase the full digital experience of its product to
                    secure <strong>future
                        investments and partnerships</strong>, particularly in <strong>healthcare sectors</strong>. One
                    thing we wanted to demonstrate in pitches is how <strong>user data</strong> collected from our
                    <strong>IoT medication adherence platform</strong> can be transformed into <strong>easy‑to‑digest
                        insights for caregivers</strong> – helping them better understand their clients' behavioural
                    patterns and providing <strong>better quality of care with less effort</strong>. The task given
                    was to design a <strong>caregiver‑facing dashboard</strong> for the primary user's account within
                    the web app that would help them better understand and assist their client.
                </p>
            </section>

            <section class="project-role">
                <h2>My role</h2>
                <p>Sole designer on this project. Reported directly to the head of product.<br>Responsible for:</p>
                <ul>
                    <li><strong>UX</strong></li>
                    <li><strong>UI</strong></li>
                    <li><strong>User research</strong></li>
                    <li><strong>Product strategy</strong></li>
                    <li><strong>Problem framing</strong></li>
                    <li><strong>Stakeholder communication</strong></li>
                    <li><strong>Data visualisation</strong></li>
                    <li><strong>Design system</strong></li>
                    <li><strong>Prototyping</strong></li>
                </ul>
            </section>

            <section>
                <h2>Problem framing</h2>

                <h3>1. Identify the scope of content</h3>
                <p>The caregiver user group here and their corresponding business context provide an important
                    <strong>constraint</strong> on the type of dashboard to aim for – a <strong>slightly data-rich
                        consumer dashboard</strong>. In order
                    to identify the scope of content relevant to such a dashboard, I turned to the <strong>user
                        research</strong>
                    material available at hand. Taking a holistic approach, I summarised the findings in a
                    <strong>hybrid
                        affinity-interrelationship diagram</strong> by synthesising <strong>user interview</strong>
                    and <strong>user observation</strong> insights with <strong>product features</strong>,
                    encompassing details on functionality, primary user datasets, metrics, and end user needs. This
                    helped to identify dashboard contents that are most relevant to our users
                </p>

                <p>Although the project was set out to mainly show <strong>simple adherence-related analytics</strong>
                    for caregivers,
                    the <strong>analysis</strong> revealed <strong>two main expectations</strong> on the functionality
                    of the dashboard:</p>

                <ul>
                    <li><strong>Behavioural insights of primary user</strong></li>
                    <li><strong>Quick access to the key operational statuses</strong> such as the remote device status
                        and medication stock.</li>
                </ul>

                <p> The first point was anticipated. The second point makes sense in hindsight – as the dashboard is the
                    home screen, users would expect to find <strong>operational information</strong> there also. These
                    two expectations
                    became both the <strong>rationale and the blueprint</strong> for a layout that
                    <strong>separates components by function.</strong>
                </p>

                <ZoomableImage
                    class="affinity-figure"
                    :src="svg1Cover"
                    :zoom-src="svg1"
                    alt="Affinity-Interrelationship Diagram"
                    caption="Hybrid affinity-interrelationship diagram based on user research findings"
                />

                <h3>2. Define the narrative</h3>
                <p>With the requirements set, I turned to the <strong>narrative</strong>. Without a strategic narrative,
                    users can
                    experience fatigue or miss key insights. It is also an opportunity to <strong>highlight and
                        reinforce
                        features</strong> that contribute to the product's value proposition. For example, the primary
                    user's mobile
                    app that I had previously designed functions as a <strong>progress hub</strong> at the home screen.
                    It has a narrative of <strong><em>encouragement</em></strong> that uses simple data presentation to
                    trigger immediate impression – cumulative
                    adherence
                    appears as a <strong>heart-shaped progress graphic</strong> leveraging the <strong>cognitive tension
                        from unfinished tasks</strong>; a
                    dispense <strong>streak</strong> leverages <strong>loss aversion</strong>. Both encourage adherence
                    behaviour.
                </p>

                <p>For the caregiver dashboard, a narrative of <strong><em>synopsis</em></strong> is needed, providing
                    <strong>feedback across the three-part
                        system</strong> of caregiver, client and the IoT platform to drive <strong>positive
                        actions</strong> that help improve the
                    clients’ medication adherence. For example, having a daily adherence trend that also shows missed
                    doses that were later compensated by an ad hoc dispense; a chart showing when missed doses most
                    often occur.
                </p>

                <p>Based on user research, although the caregivers have more <strong>ability</strong> to explore data
                    than their clients,
                    they do not necessarily have the time for lengthy data discovery in their daily work. Therefore,
                    while they can handle multivariate plots, the data visualisation should be simple, highlight
                    <strong>straightforward patterns and trends</strong>, and show a <strong>limited number of
                        widgets</strong> compared to typical
                    analytical dashboard.
                </p>

            </section>

            <section>
                <h2>Design</h2>

                <h3>1. Prompts for stakeholders and AI</h3>
                <p>The contents take priority here. I began by <strong>sketching a range of data visualisation
                        widgets</strong> without worrying
                    about screen layout. Some charts were discarded early; others moved into <strong>high‑fidelity
                        wireframes and prototypes</strong>. This allowed the best solutions to emerge before I
                    established <strong>hierarchy</strong> and committed
                    to the layout. It also gave me <strong>early artifacts</strong> to share
                    with stakeholders,
                    <strong>speeding up iterations</strong>.
                </p>
                <p>In my design workflow, I also used these wireframes as <strong>image prompts</strong> in
                    <strong>Figma Make</strong> to generate
                    mockups. I reasoned that while the <strong>AI-generated artifacts</strong> were far from
                    production-ready, they could
                    <strong>accelerate decision-making</strong> by serving as a crude baseline for <strong>design
                        audits</strong>. The process
                    helped me identify reusable <strong>UI ideas</strong> and potential <strong>friction points</strong>
                    before diving into high-fidelity
                    prototyping.
                </p>

                <div class="full-image">
                    <img :src="img2" alt="Mockups" width="3014" height="1697" loading="lazy" decoding="async" />
                    <p class="caption">Wireframes for the caregiver-facing dashboard's widgets juxtaposed with
                        mockups of the primary user's mobile dashboard</p>
                </div>

                <h3>2. Design for accessibility</h3>
                <p>Working within the constraints of the existing design system, I updated the colour system of the
                    product by <strong>adding new accent colours</strong> to accommodate the dashboard design.
                    Consistent with the rest of the product, I improved accessibility the design according to
                    <strong>WCAG</strong>.
                </p>

                <p>To improve distinguishability, I <strong>audited</strong> colour contrast for text and graphics
                    was using <strong>WebAIM</strong> and adjusted to meet WCAG 2.1 AA. When
                    colour contrast was deemed insufficient, I used <strong>borders</strong> to improve accessibility
                    of graphics. <strong>Interactive dynamic features</strong> were incorporated in charts to enable
                    <strong>isolating datasets</strong> for clarity.
                </p>

                <p>I also ensured there is a <strong>consistent association between categorical variables
                        and colours used</strong>. This not only important for visual coherence across the interface but
                    can also improve data comprehension as the <strong>human brain processes colours much faster than
                        words</strong>.</p>

                <p>To improve understandability, I included <strong>interactive data labels</strong> for the chars so
                    that comprehension is not solely reliant on plotting style. This is also crucial for
                    <strong>accessibility</strong>
                    of those with <strong>colour vision deficiency</strong>.
                </p>

                <div class="full-image">
                    <img :src="img3" alt="Colour system" width="2882" height="1623" loading="lazy" decoding="async" />
                    <p class="caption">Colour palettes for the dashboard design with colour contrast audit for WCAG
                        compliance</p>
                </div>

                <h3>3. Optimising visual perception for the narrative</h3>
                <p>To <strong>optimise comprehension</strong> of multivariate data, I prioritised <strong>familiar chart
                        types</strong>, such as bar, pie,
                    and line, as they are already stored in our collective psyche. Nonetheless, choosing the suitable
                    graph for a particular dataset requires <strong>holistic consideration</strong> of the context,
                    narrative,
                    aesthetics, and practical UX.
                </p>

                <p>For example, it is feasible to present the summary of the type and punctuality of dispenses, which
                    are made up of distinct data categories, in either a bar chart, pie chart, or donut chart. The goal
                    of this particular data visualisation is to <strong>show the proportions of the categories in order
                        to
                        highlight edge cases</strong>s, some of which are undesirable behaviour outcomes of primary
                    users. A priori,
                    with optimal usage of our product, I anticipated that the dataset would be <strong>heavily skewed
                        towards
                        one category</strong>. In this case, the <strong>circular chart type trumps the bar
                        chart</strong> for two reasons:</p>

                <ul>
                    <li>It avoids the impression of incomplete data when the dataset is dominated by one category since
                        the visual nature of a circular chart leaves <strong>no empty spaces</strong>. Thus, it provides
                        a more <strong>compact
                            and harmonious visualisation</strong> than a bar chart.</li>
                    <li>It makes edge cases far more visually striking since they are presented as <strong>elements that
                            disrupt</strong>
                        a circle. In combination with high contrast colours, it is highly effective for highlighting
                        edge cases that need attention.</li>
                </ul>

                <p>Therefore, circular charts are more aligned with the narrative we aimed for. As to whether a pie or
                    donut chart is preferred, the <strong>donut</strong> has the advantage of enabling better perception
                    of the
                    proportions of the wedges: the <strong>human brain is biased toward reading lengths (the arc) more
                        accurately than areas or angles.</strong></p>

                <div class="full-image">
                    <img :src="img4" alt="Design iterations" width="2617" height="647" loading="lazy"
                        decoding="async" />
                    <p class="caption">Design iterations of Dispense Summary</p>
                </div>

                <h3>4. Integrating multiple variables without losing clarity</h3>
                <p><strong>Adherence</strong> is the most important KPI of the product for users. Although a
                    <strong>single‑number cumulative average</strong> is an impactful quick overview, a <strong>daily
                        trend</strong> is highly informative. It helps track the primary user's performance in
                    <strong>real
                        time</strong> and reveal behaviour patterns. Crucially, in our product, adherence is not just
                    the
                    result of the primary user's interaction with the IoT platform. <strong>Caregiver intervention via
                        remote ad‑hoc dispense</strong> of missed dose (Missed‑dose Dispense) also influences the
                    adherence outcome. Showing both together gives users an <strong>integrated view of
                        behaviour</strong> which also directly addresses needs that emerged in user research, helping
                    caregivers identify when their <strong>intervention changes the adherence outcome</strong>.
                </p>

                <p>However, <strong>overlaying variables is double edged</strong>. The visual comparison helps users,
                    but the complexity
                    can be confusing. I addressed this by adding toggles that allow users to <strong>isolate the
                        variables</strong> they
                    wished to display. I also included a <strong>hover-activated data label</strong> that summarises all
                    variables at a
                    specific time point to <strong>eliminate guesswork</strong>.</p>

                <VideoPair :left-src="vid5" :right-src="vid6"
                    caption="Designs of Adherence Trend and Missed Dose Insights widgets" />

                <h3>5. From logs to insights</h3>
                <p>I have also <strong>anticipated the log data</strong> that can be used to generate insights on client
                    behaviour. For
                    example, the caregivers wanted to know more about <strong>when their clients usually miss
                        medications</strong>. The
                    answer to this is <strong>twofold</strong>. The features of the IoT system enable missed doses from
                    a previously
                    scheduled dispense (Scheduled Dispense) to be <strong>compensated later</strong> via an ad-hoc
                    dispense (Missed-dose
                    Dispense) within a pharmacologically suitable timeframe. Therefore, it is feasible for a scheduled
                    dispense event to have a final status of <em>dispensed</em> with a <strong>historical
                        status</strong> of <em>medications missed</em>.
                    Thus, the <strong>initial missed doses do not always correspond to the final missed doses</strong>.
                    To provide
                    behaviour insights, <strong>both the datasets are of equal importance</strong>. I therefore needed
                    to present them
                    both together in a way that allows users to perceive their relationship and differences with
                    <strong>minimal
                        cognitive effort</strong>.
                </p>

                <p><strong>Interactivity</strong> plays an important role. A simple <strong>toggle</strong> that allows
                    users to isolate the two datasets
                    would enable them to <strong>intuitively learn their relationship</strong>. Since I’m introducing to
                    the users a <strong>new concept</strong> around missed-dose data – gross missed doses that have not
                    been
                    corrected by
                    compensatory Missed-dose
                    Dispense – it is important to clarify it by including expandable tooltips.
                </p>

                <p>In terms of data visualisation, to help simplify the presentation of time, I have divided a day into
                    <strong>six bins</strong>. This also has the advantage of being <strong>aligned with typical human
                        daily routines</strong>. To help
                    users get <strong>a sense of proportion</strong> of the missed doses, I used Scheduled Dispense data
                    as a <strong>baseline
                        backdrop</strong> for comparison. Although the simplicity of the data visualisation should speak
                    for itself,
                    it is useful to explicitly spell out the insights. I included <strong>dynamic descriptive
                        text</strong> that
                    highlights key takeaways and updates based on the datasets isolated by users.
                </p>


                <p>Crucially, the juxtaposition of the two datasets has also helped highlight the positive effect of
                    <strong>caregiver intervention</strong> on clients’ adherence <strong>via our IoT system</strong>.
                </p>


                <h3>6. Divide and conquer</h3>
                <p>Earlier in discovery, I identified <strong>two distinct user goals</strong> when engaging with the
                    dashboard:
                </p>
                <ul>
                    <li>
                        <strong>Gaining insights into client behaviour</strong> - this consists of widgets of data
                        visualisation of
                        processed user data. They are providing <strong>longer-term feedback</strong> to the users. The
                        analysis timeframe is often of
                        scale from <strong>a week to months</strong>.
                    </li>
                    <li>
                        <strong>Checking key operational statuses</strong> - this consists of widgets of status report
                        such as snippets
                        of latest events, the conditions of the remote device, medication stocks. They are
                        <strong>real-time
                            feedback</strong>.
                    </li>
                </ul>

                <p>Therefore, these two goals required a <strong>clear division of content</strong> to minimise
                    <strong>friction for both the
                        users and the system.</strong>
                </p>

                <p>I addressed this by introducing a <strong>retractable sidebar</strong> to contain operational status
                    widgets – a
                    feature that is distinct from the dashboard but visually integrated as part of it. The enforced
                    <strong>perceptual grouping</strong>, as the result of creating boundaries between the two sets of
                    content, makes
                    their distinct purposes immediately clear.
                </p>

                <p>Given the time sensitive nature of the sidebar content, this isolated section supports a
                    <strong>higher auto-refresh rate</strong> than the rest of the dashboard, so users always see the
                    latest operational data. In the
                    edge case of connection lost, a <strong>timestamp</strong> appears to clarify that the data is not
                    live, helping
                    instil <strong>user confidence</strong> in the application's reliability.
                </p>

                <p>I also took care to keep the sidebar content <strong>concise</strong>, showing only important
                    snippets so they don't
                    overshadow the main app features where users can find more detailed information.</p>

                <figure class="full-image full-image--captioned">
                    <div class="full-image-media">
                        <video class="project-video" :src="vid7" autoplay loop muted playsinline />
                    </div>
                    <figcaption class="caption">Caregiver-facing dashboard demo</figcaption>
                </figure>
            </section>

            <section id="results">
                <h2>Results</h2>
                <p>The dashboard design was a <strong>crucial part of the company's investor pitch</strong>,
                    demonstrating how IoT data
                    could be translated into easily digestible and actionable insights for caregivers. It was
                    <strong>well
                        received by investors</strong>, who noted clear consideration of the specific <strong>context of
                        the healthcare
                        sector</strong> and attention to the target <strong>user's needs.</strong>
                </p>

                <p>In an <strong>interview feedback session</strong> with caregivers (n=6), <strong>v100% responded
                        positively</strong> to the design. The
                    <strong>clarity of the data presentation</strong> was specifically highlighted. Most found the
                    layout <strong>easy to
                        comprehend and navigate</strong>. One user noted that a simple product tour could be beneficial
                    given the
                    number of widgets present. In general, they felt that the product feature would help <strong>improve
                        the
                        quality of care</strong> that they can deliver by <strong>lowering the effort</strong> required
                    for monitoring and
                    understanding their clients' behaviours. The design was also successful in highlighting features
                    that contribute to the IoT product's <strong>value proposition</strong>, in particular the
                    <strong>remote dispense function</strong>,
                    for which caregivers are the primary users.
                </p>

                <p>From an <strong>engineering perspective</strong>, the prototypes established a clear path for
                    <strong>backend data structure and integration with the hardware solution</strong>. This was made
                    possible by the attention not only to visual aspects, but to the <strong>user lifecycle, data
                        requirements and hardware constraints</strong>.
                </p>

                <p>Overall, the project succeeded in achieving its <strong>0‑to‑1 objectives</strong>, considered
                    both <strong>business and user needs</strong>, and laid the groundwork for <strong>subsequent
                        design and development initiatives</strong>.</p>
            </section>

            <section>
                <h2>Reflection</h2>
                <p>This 0‑to‑1 initiative delivered polished, high‑fidelity prototypes that piqued investor interest
                    and demonstrated product viability. Looking back, there are a few things I would
                    <strong>approach differently</strong>. Although it was essential to produce some visually polished
                    prototypes as quickly as possible for demo purposes in pitches, I would have taken more time to
                    <strong>better define the interaction logic</strong> of the modules at the
                    <strong>low‑fidelity stage</strong>. This would have allowed for <strong>faster iteration</strong>
                    on interaction without being bogged down by pixels. While a comprehensive
                    suite would not be feasible at this 0‑to‑1 stage, <strong>lean documentation</strong> capturing
                    key design decisions, such as data considerations, accessibility, UI states, and interaction
                    specs, would provide a clearer <strong>foundation for the next phase</strong> of development.
                </p>

                <p>For future development, <strong>customisation</strong> and <strong>personalisation</strong> could
                    bring value to the product:</p>

                <ul>
                    <li>
                        <em>Usability testing for enterprise customisation</em>
                        <p>The feedback session validated the core design, but <strong>structured usability
                                testing</strong>
                            is crucial for the next phase. A reality check would allow us to evaluate how well the
                            dashboard fits with the workflows of the caregiving enterprise, and thus helps determine
                            the requirements of subsequent iterations depending on the customers' needs.</p>
                    </li>

                    <li>
                        <em>Data-driven personalisation</em>
                        <p>Pushing the UX boundaries, an <strong>adaptive UI</strong> can be implemented in future
                            iterations; automatically reconfigure the dashboard based on <strong>tracked engagement
                                data</strong>, surface high engagement widgets, and deprioritise those with lower
                            engagement. The <strong>feedback loop</strong> between behavioural data and interface design
                            allows the dashboard to become more <strong>personalised</strong>, giving the product a
                            <strong>competitive edge</strong>.
                        </p>
                    </li>
                </ul>
            </section>
        </div>
    </ProjectDetail>
</template>

<script>
import ProjectDetail from './ProjectDetail.vue'
import ProjectDetailHeader from '../components/ProjectDetailHeader.vue'
import ProjectTldrButton from '../components/ProjectTldrButton.vue'
import ZoomableImage from '../components/ZoomableImage.vue'
import VideoPair from '../components/VideoPair.vue'
import tldrMarkdown from '../data/dashboardDesignCaseStudy.md?raw'
import {
    dashboardHero,
    svg1Cover,
    svg1,
    img2,
    img3,
    img4,
    vid5,
    vid6,
    vid7,
} from '../data/dashboardDesignMedia.js'

const tldrSummaryItems = [
    {
        lead: 'Sole designer',
        body: '0-to-1 design of a customer-facing dashboard of the web app of an IoT medication platform.',
    },
    {
        lead: 'Turned user research into architecture',
        body: 'Identified two sets of user needs (behavioural insights + operational status) to drive the dashboard layout.',
    },
    {
        lead: 'Anticipated and visualised complex data',
        body: 'Defined data requirements before data pipeline existed. Translated logs, events, and device statuses into simple data visualisation.',
    },
    {
        lead: 'Achieved user validation and investor buy-in',
        body: 'Delivered a pitch‑ready prototype with 100% positive feedback from caregivers (n=6) in interview sessions.',
    },
]

export default {
    name: 'DashboardDesign',
    components: { ProjectDetail, ProjectDetailHeader, ProjectTldrButton, ZoomableImage, VideoPair },
    data() {
        return {
            dashboardHero,
            svg1Cover,
            svg1,
            img2,
            img3,
            img4,
            vid5,
            vid6,
            vid7,
            tldrSummaryItems,
            tldrMarkdown,
        }
    },
}
</script>

<style>
.full-image.affinity-figure .caption {
    margin-top: 35px;
}
</style>
