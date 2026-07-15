<template>
    <ProjectDetail full-width-images>
        <div class="project-hero">
            <img
                :src="dashboardHero"
                alt="Dashboard hero"
                width="2400"
                height="1352"
                decoding="async"
                fetchpriority="high"
            />
        </div>

        <ProjectDetailHeader
            title="IoT Adherence Analytics for Caregivers: Dashboard Design"
            client="Kin Technology"
            period="2026 - Ongoing"
        />

        <div class="project-body">
            <section>
                <h2>The Challenge</h2>
                <p>Kin needed to showcase the full digital experience of its product to secure <strong>future
                    investments and partnerships</strong>, particularly in <strong>healthcare sectors</strong>. One
                    thing we wanted to demonstrate in pitches is how <strong>user data</strong> collected from our
                    <strong>IoT medication adherence platform</strong> can be transformed into <strong>easy‑to‑digest
                    insights for caregivers</strong> – helping them better understand their clients' behavioural
                    patterns and providing <strong>better quality of care with less effort</strong>. The task given
                    was to design a <strong>caregiver‑facing dashboard</strong> for the primary user's account within
                    the web app that would help them better understand and assist their client.</p>
            </section>

            <section class="project-role">
                <h2>My role</h2>
                <p>Sole designer on this project.<br>Responsible for:</p>
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
                    constraint on the type of dashboard to aim for – a <strong>slightly data‑rich consumer
                    dashboard</strong>. <strong>User research</strong> was crucial for us in narrowing down the scope
                    of relevant content in the discovery phase. Taking a holistic approach in exploring the available
                    materials, I summarised the findings in a <strong>hybrid affinity‑interrelationship
                    diagram</strong> by synthesising user interview insights with product features, encompassing
                    details on functionality, primary user datasets, metrics, and end‑user needs. This helped to
                    identify dashboard contents that are most relevant to our users.</p>

                <p>Although the project was set out to mainly show <strong>simple adherence‑related analytics</strong>
                    for caregivers, the user research revealed <strong>two main expectations</strong> on the
                    functionality of the dashboard:</p>

                <p>(1) <strong>Behavioural insights of primary user</strong><br>
                    (2) <strong>Quick access to the key operational statuses</strong> such as the remote device status
                    and medication stock.</p>

                <p>Point 1 was anticipated. Point 2 makes sense in hindsight – as the dashboard is the home screen,
                    users would expect to find operational information there also. These two distinct expectations
                    became both the <strong>rationale and the blueprint</strong> for a layout that <strong>separates
                    components by function</strong>.</p>

                <ZoomableImage
                    :src="svg1Cover"
                    :zoom-src="svg1"
                    alt="Affinity-Interrelationship Diagram"
                    caption="Affinity-Interrelationship Diagram based on user research findings"
                />

                <h3>2. Define the narrative</h3>
                <p>With the framework set, I turned to the <strong>narrative</strong>. Without a strategic narrative,
                    users can experience fatigue or miss key insights. It is also an opportunity to <strong>highlight
                    and reinforce features</strong> that contribute to the product's value proposition.</p>

                <p>Take the primary user's mobile app that I had previously made as an example. It functions as a
                    <strong>progress hub</strong> at the home screen. Its <strong>encouragement narrative</strong>
                    uses simple data presentation to trigger immediate impression and action. For instance,
                    cumulative adherence appears as a <strong>heart‑shaped progress graphic</strong> leveraging the
                    <strong>cognitive tension from unfinished tasks</strong>. A dispense streak leverages <strong>loss
                    aversion</strong>. Both encourage adherence behaviour.</p>

                <p>Based on user research, the caregiver dashboard needs a <strong>synopsis narrative</strong>.
                    Caregivers have more capacity to explore data than primary users, but they are <strong>not
                    analysts</strong> – nor do they necessarily have the time for data discovery in their daily work.
                    Therefore, while they can handle multivariate plots, the data visualisation should be
                    <strong>simple</strong> and highlight <strong>straightforward patterns and trends</strong>. For
                    example, a <strong>daily adherence trend</strong> that also shows missed doses that were later
                    compensated by an <strong>ad‑hoc dispense</strong>; a chart showing <strong>when missed doses
                    most often occur</strong>. The aim is data visualisation that provides <strong>constructive
                    feedback</strong> to drive positive behaviour for both caregiver and client.</p>
            </section>

            <section>
                <h2>Design</h2>

                <h3>1. Plot first, compose later</h3>
                <p>I began by <strong>sketching a range of data visualisation widgets</strong> without worrying
                    about screen layout. Some charts were discarded early; others moved into <strong>high‑fidelity
                    wireframes and prototypes</strong>. This allowed the best solutions to emerge before I committed
                    to composition. It also gave me <strong>early artifacts</strong> to share with stakeholders,
                    <strong>speeding up iterations</strong>.</p>

                <div class="full-image">
                    <img
                        :src="img2"
                        alt="Mockups"
                        width="3014"
                        height="1697"
                        loading="lazy"
                        decoding="async"
                    />
                    <p class="caption">On the left: mockups of primary user's mobile dashboard. On the right:
                        wireframes for caregiver-facing dashboard.</p>
                </div>

                <h3>2. Design for accessibility</h3>
                <p>I updated the colour system of the product by <strong>adding new accent colours</strong> to
                    accommodate the dashboard design. Consistent with the rest of the product, I optimised the design
                    according to <strong>WCAG criteria of accessibility</strong>. To improve distinguishability,
                    colour contrast for text and graphics was <strong>audited using WebAIM</strong> and adjusted to
                    meet <strong>WCAG 2.1 AA</strong>. When colour contrast was deemed insufficient, I used
                    <strong>borders</strong> to improve accessibility of graphics. <strong>Interactive dynamic
                    features</strong> were incorporated in charts to enable <strong>isolating datasets</strong> for
                    clarity.</p>

                <p>For understandability, <strong>every chart includes data labels</strong>. This ensures
                    comprehension is not reliant on plotting style alone – supporting both novice users and those
                    with <strong>reduced colour perception</strong>.</p>

                <p>Alongside text labels, I also ensured <strong>consistent association between categorical variables
                    and distinctive colours</strong> within the constraints of the colour palette. This not only
                    provides interface consistency but can also improve data comprehension by <strong>leveraging the
                    brain's ability to process colours much faster than words</strong>.</p>

                <div class="full-image">
                    <img
                        :src="img3"
                        alt="Colour system"
                        width="2882"
                        height="1623"
                        loading="lazy"
                        decoding="async"
                    />
                    <p class="caption">Colour palettes for the dashboard design with colour contrast audit for WCAG
                        compliance</p>
                </div>

                <h3>3. Optimising visual perception for the narrative</h3>
                <p>To optimise comprehension of multivariate data, I prioritised <strong>familiar chart types, such
                    as bar, pie, and line</strong>, as they are already stored in our collective psyche. Nonetheless,
                    choosing the right graph for a particular dataset requires holistic consideration of
                    <strong>context, narrative, aesthetics, and practical UX</strong>.</p>

                <p>For example, it is feasible to present the summary of the type and punctuality of dispenses,
                    which are made up of distinct data categories, in either a bar chart, pie chart, or donut chart.
                    The goal of this particular data visualisation is to <strong>show the proportions of the
                    categories in order to highlight edge cases</strong>, some of which are undesirable behaviour
                    outcomes of primary users. A priori is that, with optimal usage of our product, the dataset is
                    going to be <strong>heavily dominated by one category</strong>. In this case, the <strong>circular
                    chart type trumps the bar chart</strong> for two reasons:</p>

                <p>(1) In the sense of aesthetics and practical UX, a circular chart leaves <strong>no empty
                    spaces</strong> that might give the impression of incompleteness when the dataset is dominated by
                    one category. This provides a more <strong>intuitive, compact, and harmonious
                    visualisation</strong> than a bar chart.</p>

                <p>(2) For highlighting edge cases, <strong>elements that disrupt a circle or continuous
                    ring</strong>, combined with high‑contrast colours, are <strong>far more visually striking</strong>
                    than short blocks that rise above the axis in a bar chart.</p>

                <p>Therefore, it is more effective in conveying the narrative we aimed for. As to whether a pie or
                    donut chart is preferred, the <strong>donut</strong> has the advantage of enabling better
                    perception of the proportions of the wedges: <strong>the human brain is biased toward reading
                    lengths (the arc) more accurately than areas or angles</strong>.</p>

                <div class="full-image">
                    <img
                        :src="img4"
                        alt="Design iterations"
                        width="2617"
                        height="647"
                        loading="lazy"
                        decoding="async"
                    />
                    <p class="caption">Design iterations of Dispense Summary</p>
                </div>

                <h3>4. Integrating multiple variables without losing clarity</h3>
                <p><strong>Adherence</strong> is the most important KPI of the product for users. Although a
                    <strong>single‑number cumulative average</strong> is an impactful quick overview, a <strong>daily
                    trend</strong> is highly informative. It helps track the primary user's performance in <strong>real
                    time</strong> and reveal behaviour patterns. Crucially, in our product, adherence is not just the
                    result of the primary user's interaction with the IoT platform. <strong>Caregiver intervention via
                    remote ad‑hoc dispense</strong> of missed dose (Missed‑dose Dispense) also influences the
                    adherence outcome. Showing both together gives users an <strong>integrated view of
                    behaviour</strong> which also directly addresses needs that emerged in user research.</p>

                <p>However, overlaying variables is <strong>double‑edged</strong>. The visual comparison helps users,
                    but the complexity can be confusing. I addressed this by adding <strong>toggles</strong> that
                    allow users to select the variables they wished to display. I also included a <strong>hover data
                    label</strong> that summarises all variables at a specific time point, helping users interpret the
                    graph <strong>without guesswork</strong>.</p>

                <VideoPair
                    :left-src="vid5"
                    :right-src="vid6"
                    caption="Prototype of Missed Dose Insights"
                />

                <h3>5. From logs to insights</h3>
                <p>Another aspect of the project involved exploring <strong>log data</strong> that users may not
                    readily recognise but that offers meaningful insight into client behaviour. For example, users
                    wanted to know more about missed doses, specifically <strong>what time of day they usually
                    happen</strong>. This led me to present the log of when primary users first miss a dose during a
                    <strong>previously scheduled dispense (Scheduled Dispense)</strong>.</p>

                <p>The timing and quantity of <strong>initial missed doses</strong> are informative, though they do
                    not always correspond to <strong>final missed doses</strong>, as some are later corrected via
                    <strong>Missed‑dose Dispense</strong>. I therefore needed to present both datasets in a way that
                    allows users to perceive their relationship and differences with <strong>minimal cognitive
                    effort</strong>.</p>

                <p>I explored several approaches. For data visualisation, I implemented the following:</p>

                <p>(1) <strong>Division of the day into six time bins</strong>, which simplifies presentation and
                    aligns with typical daily routines.<br>
                    (2) Inclusion of <strong>Scheduled Dispense data as a baseline</strong> for comparison with missed
                    doses.<br>
                    (3) Use of <strong>dynamic text labels</strong> to highlight key takeaways.</p>

                <p>For interactivity, I added the following features:</p>

                <p>(1) A <strong>toggle</strong> to show or hide Missed‑dose Dispense data, enabling users to explore
                    the relationship between datasets.<br>
                    (2) <strong>Expandable tooltips</strong> to clarify unfamiliar variables and reduce confusion.<br>
                    (3) <strong>Hover‑activated data labels</strong> that provide precise quantitative information on
                    specific data segments.</p>

                <h3>6. Divide and conquer</h3>
                <p>Early in discovery, I identified <strong>two distinct user goals</strong> when engaging with the
                    dashboard: (1) <strong>gaining insights into client behaviour</strong>, and (2) checking
                    <strong>key operational statuses</strong> of the remote device. These two goals required a
                    <strong>clear division of content</strong> to minimise friction that users could experience while
                    seeking for information.</p>

                <p>I addressed this by introducing a <strong>retractable sidebar</strong> to contain operational
                    status widgets – a feature that is distinct from the dashboard but <strong>visually
                    integrated</strong> as part of it. The enforced perceptual grouping, as the result of creating
                    boundaries between the two sets of content, makes their distinct purposes <strong>immediately
                    clear</strong>.</p>

                <p>Given the <strong>time‑sensitive nature</strong> of the sidebar content, this isolated section
                    supports a <strong>higher auto‑refresh rate</strong> than the rest of the dashboard, so users
                    always see the latest operational data. In the edge case of connection lost, a
                    <strong>timestamp</strong> appears to clarify that the data is not live, helping instil
                    <strong>user confidence</strong> in the application's reliability.</p>

                <p>I also took care to keep the sidebar content <strong>concise</strong>, showing only important
                    snippets so they don't overshadow the main app features where users can find more detailed
                    information.</p>

                <div class="full-image">
                    <video
                        class="project-video"
                        :src="vid7"
                        autoplay
                        loop
                        muted
                        playsinline
                    />
                </div>
            </section>

            <section>
                <h2>Results</h2>
                <p>The dashboard design was a <strong>crucial part of the company's investor pitch</strong>,
                    demonstrating how IoT data could be translated into <strong>easily digestible and actionable
                    insights for caregivers</strong>. It was well received by investors, who noted clear consideration
                    of the specific context of the healthcare sector and attention to the target user's needs.</p>

                <p>In a feedback session with <strong>6 caregivers</strong>, all participants responded positively to
                    the UX and visual design, and specifically highlighted the <strong>clarity of the data
                    presentation</strong>. Most found the layout <strong>intuitive and easy to navigate</strong>,
                    while a few found that a simple product tour could be beneficial given the number of widgets
                    present. The design was also successful in <strong>highlighting features</strong> that contribute
                    to the IoT product's value proposition, in particular the <strong>remote dispense function</strong>,
                    for which caregivers are primary users. In general, the caregivers felt that the product feature
                    could help improve the quality of care that they can deliver by <strong>lowering the
                    effort</strong> required for monitoring and understanding their clients' behaviours.</p>

                <p>From an <strong>engineering perspective</strong>, the prototypes established a clear path for
                    <strong>backend data structure and integration with the hardware solution</strong>. This was made
                    possible by the attention not only to visual aspects, but to the <strong>user lifecycle, data
                    requirements and hardware constraints</strong>.</p>

                <p>Overall, the project succeeded in achieving its <strong>0‑to‑1 objectives</strong> and laid the
                    groundwork for <strong>subsequent design and development initiatives</strong>.</p>
            </section>

            <section>
                <h2>Reflection</h2>
                <p>This <strong>0‑to‑1 initiative</strong> delivered <strong>polished, high‑fidelity
                    prototypes</strong> that <strong>piqued investor interest</strong> and demonstrated product
                    viability. Looking back, there are a few things <strong>I would approach differently</strong>.
                    Although it was essential to produce some visually polished prototypes as quickly as possible for
                    demo purposes in pitches, I would have taken more time to <strong>better define the interaction
                    logic</strong> of the modules at the <strong>low‑fidelity stage</strong>. This would have allowed
                    for <strong>faster iteration</strong> on interaction without being <strong>bogged down by
                    pixels</strong>. While a <strong>comprehensive design documentation suite</strong> would not be
                    feasible at this 0‑to‑1 stage, <strong>lean documentation</strong> capturing key design decisions,
                    such as <strong>data considerations, accessibility, UI states, and interaction specs</strong>,
                    would provide a <strong>clearer foundation</strong> for the next phase of development.</p>

                <p>There are also several crucial aspects to consider for further development ahead regarding
                    <strong>scalability, adaptability, and data‑driven iteration</strong>:</p>

                <p><strong>(1) Usability testing for enterprise customisation.</strong></p>
                <p>The feedback session validated the core design, but <strong>structured usability testing</strong>
                    is crucial for the next phase. The reality check would allow us to evaluate <strong>how well the
                    dashboard fits with the workflows</strong> of the caregiving enterprise, and thus helps determine
                    the requirements of <strong>subsequent iterations</strong> depending on the customers' needs.</p>

                <p><strong>(2) Extending the design system.</strong></p>
                <p>A <strong>preliminary colour system</strong> was established at this stage, but a <strong>more
                    comprehensive design system</strong> will be essential, especially regarding <strong>data
                    visualisation</strong>. This should include guidelines for <strong>chart types, data density,
                    accessibility and interactions</strong>. This ensures that any new charts maintain a
                    <strong>consistent look, feel, and usability standard</strong>.</p>

                <p><strong>(3) Usage‑based prioritisation.</strong></p>
                <p>For further UX improvement, future iterations could implement an <strong>adaptive UI</strong> that
                    automatically reconfigures based on <strong>tracked engagement data</strong>.
                    <strong>High‑engagement widgets</strong> could be surfaced more prominently, while
                    <strong>lower‑engagement ones</strong> could be deprioritised, allowing the dashboard to
                    <strong>adapt dynamically</strong> to real‑world usage patterns.</p>
            </section>
        </div>
    </ProjectDetail>
</template>

<script>
import ProjectDetail from './ProjectDetail.vue'
import ProjectDetailHeader from '../components/ProjectDetailHeader.vue'
import ZoomableImage from '../components/ZoomableImage.vue'
import VideoPair from '../components/VideoPair.vue'
import dashboardHero from '../assets/1_dashboard/0_dashboard_hero_detail-2400.jpg'
import svg1Cover from '../assets/1_dashboard/1_affinity_interrelation_diagram_cover.svg'
import svg1 from '../assets/1_dashboard/1_affinity_interrelation_large_margin.svg'
import img2 from '../assets/1_dashboard/2_primary_user_vs_caregiver_dashboard.jpg'
import img3 from '../assets/1_dashboard/3_colour_system_portfolio.jpg'
import img4 from '../assets/1_dashboard/4_dispense_summary_portfolio.jpg'
import vid5 from '../assets/1_dashboard/5_adherence_trend_width.mov'
import vid6 from '../assets/1_dashboard/6_missed_dose_insights_width.mov'
import vid7 from '../assets/1_dashboard/7_caregiver_dashboard_width.mov'

export default {
    name: 'DashboardDesign',
    components: { ProjectDetail, ProjectDetailHeader, ZoomableImage, VideoPair },
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
        }
    },
}
</script>
