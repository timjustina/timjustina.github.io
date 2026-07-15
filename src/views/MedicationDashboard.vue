<template>
    <ProjectDetail>
        <h1>Improving medication adherence: Dashboard Design</h1>
        <div class="meta">
            <span>Kin Technology</span>
            <span>|</span>
            <span>2025</span>
        </div>

        <p class="intro">
            At KIN, we tackle medication adherence using IoT strategies. User data is an integral part of our
            product. We want to turn
            <strong>data into information</strong> that drives positive user behaviours. Information is only as
            meaningful as what is understood by the target audience. Therefore,
            <strong>information design</strong> is crucial.
        </p>

        <section>
            <h2>My role</h2>
            <p>I'm responsible for the <strong>0 to 1 design</strong> of dashboard components. This includes
                <strong>stakeholders communication</strong>, <strong>content selection</strong>, <strong>data
                    visualisation</strong>, <strong>design system</strong> and <strong>high-fidelity
                    prototypes</strong>.
            </p>
        </section>

        <div class="full-image hero-image">
            <img :src="img0" alt="Dashboard hero" />
        </div>

        <section>
            <h2>The Challenge</h2>
            <p>Showcasing the full extent of the digital experience of Kin's product is important for the company to
                secure future investments and partnerships. One of the objectives is to gain traction with some
                investors that are interested in the products' application across healthcare providers. It is
                important for us to demonstrate how <strong>user data</strong> collected from our IoT home
                medication management platform can be transformed into <strong>easy-to-digest insights</strong> for
                <strong>caregivers</strong>. The information provided should help them better understand their
                clients' behavioural patterns and needs, and thus, providing better quality of care with less
                effort. The task here is to design the <strong>caregiver-facing dashboard</strong> for the primary
                user's account within the web app.
            </p>
        </section>

        <section>
            <h2>Discover & Define</h2>
            <h3>Identify the scope of content</h3>
            <p>The data that can be collected from our IoT product is abundant; however, not all of it will be
                useful for generating meaningful information. Therefore, narrowing down the scope of
                <strong>relevant content</strong> for the dashboard was a crucial step in the discovery phase. I
                generated a <strong>hybrid affinity-interrelationship diagram</strong> by synthesising user
                interview insights with product features, encompassing details on <strong>functionality</strong>,
                primary user <strong>datasets</strong>, <strong>metrics</strong>, and end-user
                <strong>needs</strong>. The <strong>holistic approach</strong> in exploring the available materials
                had helped us to identify dashboard contents that are most relevant to our users.
            </p>

            <ZoomableImage
                :src="svg1"
                alt="Affinity-Interrelationship Diagram"
                caption="Affinity-Interrelationship Diagram based on user research findings"
            />

            <h3>Define the narrative</h3>
            <p>User-driven exploration is an important aspect of dashboard design, and so is
                <strong>storytelling</strong>. Indeed, the capacity for interactivity is a key strength of
                dashboards as well as a necessity of the digital medium for users to attain data comprehension.
                However, even when the data are clearly segmented for visual search, whether users will exhibit
                efficient goal-driven information seeking is highly context dependent. If the interactive data
                exploration in dashboard is not <strong>constrained with strategic narratives</strong>, this can
                lead to user disengagement or fatigue - a problem that users of data visualisation softwares, such
                as Tableau or Power BI, can encounter. The lack of <strong>customisation of data
                    visualisation</strong> to the <strong>context of the product</strong> also represents a missed
                opportunity in developing and <strong>re-enforcing the values of the company</strong>. Therefore, we
                need to tell our stories.
            </p>

            <p>I have previously prototyped mobile dashboard components and widgets for primary users of the Kindo
                machine. The narrative of the design placed emphasis on <strong>encouragement</strong>; using clear
                and simple data presentations that aim to trigger <strong>immediate impression</strong> and
                <strong>positive actions</strong> for achieving adherence. For example, KPIs were summarised as
                single values for quick information access. Leveraging the <strong>psychological drive for
                    completion</strong> (Zeigarnik effect - cognitive tension from unfinished tasks, reinforced
                visually by Gestalt's Law of Closure), percentage of cumulative adherence was shown with a progress
                indication graphic. A dispense streak was also designed on the same principles, with the additional
                psychological motivation of <strong>loss aversion</strong>.
            </p>

            <p>For this task, the design narrative places emphasis on the <strong>synopsis</strong>. Based on the
                user research, the aims are to provide: 1) <strong>insights into primary users' behaviours</strong>
                that help improve adherence; and 2) <strong>quick access to the key statuses</strong> of the remote
                device and medication stock for optimal maintenance of its function. Caregiver users are anticipated
                to have more capacity to explore primary users' data than primary users themselves. Therefore, data
                can be presented in <strong>multiple dimensions</strong> for users to explore to find patterns.
                Nonetheless, these users are not specialists in data analysis, nor do they necessarily have the time
                for data discovery in their line of work. Thus, data visualisation should be
                <strong>impact-focused</strong>, <strong>highlighting straightforward patterns and trends</strong>
                in primary users' behaviours and <strong>providing feedback that drives positive behaviours</strong>
                in both caregivers and primary users.
            </p>
        </section>

        <section>
            <h2>Design</h2>

            <div class="full-image">
                <img :src="img2" alt="Mockups" loading="lazy" decoding="async" />
                <p class="caption">On the left: mockups of primary user's mobile dashboard. On the right: wireframes
                    for caregiver-facing dashboard.</p>
            </div>

            <h3>Plot first, compose later</h3>
            <p>The design process began with creating a range of data visualisation widgets <strong>without getting
                    constrained by screen layout</strong> considerations. Some charts were discarded early on at the
                sketching stage, while others were tested later during high-fidelity wireframing or prototyping.
                This process encompassed exploration and experimentation, <strong>allowing optimal data
                    visualisation solutions to emerge</strong> before getting bogged down by composition and layout.
                It also provided materials to garner feedback from stakeholders for efficient design iterations.</p>

            <h3>Optimising visual perception for the narrative</h3>
            <p>To optimise <strong>comprehension of multivariate data</strong>, often it is best to use charts that
                have been frequently used and stored in our collective psyche - meaning bar charts, pie charts, line
                graphs or other <strong>simple derivatives of well-used methods</strong> are excellent templates.
                Nonetheless, since a dataset can be presented in various ways, choosing the suitable graph for a
                particular dataset requires <strong>holistic consideration</strong> of product
                <strong>context/narrative</strong>, <strong>aesthetics</strong> and <strong>practical UX</strong>.
            </p>

            <p>For example, it is feasible to present the summary of the type and punctuality of dispenses, which
                are made up of distinct data categories, in either bar chart, pie chart or donut chart. The
                <strong>goal</strong> of this particular data visualisation is to show the proportions of each
                categories in order to <strong>highlight edge cases</strong>, which some are undesirable behaviour
                outcomes of primary users. A <strong>priori</strong> is that, with the optimal usage of our product,
                the dataset is going to be <strong>heavily dominated by one category</strong>. In this case,
                circular chart type trumps bar chart for two reasons: 1) in the sense of aesthetics and practical
                UX, the use of <strong>circular chart types</strong> would mean no empty spaces in the chart that
                may give the impression of incomplete when the dataset is dominated by one category. Thus, it
                provides a more <strong>intuitive, compact</strong> and <strong>harmonious</strong> visualisation
                than bar chart; 2) for highlighting edge cases, <strong>elements that disrupt</strong> a circle or
                continuous ring, in combination with the use of colours with high contrast, is a lot more
                <strong>visually striking</strong> than looking out for short blocks that rise above the axis in a
                bar chart. Therefore, it is more effective in conveying the narrative we aimed for. As to whether a
                pie chart or a <strong>donut chart</strong> is preferred, the latter has the advantage over pie
                chart in enabling <strong>better perception</strong> of the <strong>proportion</strong> of the
                wedges - as human brain is bias for reading lengths better than areas or angles.
            </p>

            <div class="full-image">
                <img :src="img3" alt="Colour system" loading="lazy" decoding="async" />
                <p class="caption">Colour palettes for the dashboard design with colour contrast audit for WCAG
                    compliance</p>
            </div>

            <div class="full-image">
                <img :src="img4" alt="Design iterations" loading="lazy" decoding="async" />
                <p class="caption">Design iterations of Dispense Summary</p>
            </div>

            <h3>Integrating multiple variables without losing clarity</h3>
            <p>Adherence is the most important KPI of the product for users. Although it is an impactful quick
                overview to display a single number KPI of a cumulative average of adherence, it is also highly
                informative to display daily adherence as a <strong>trend</strong>. It can serve to keep track of
                primary user's <strong>performance in real time</strong> with more details, as well as showing
                potential behaviour patterns. In our product, adherence is not just the result of <strong>primary
                    users interaction</strong> with the IoT platform, but also that of <strong>caretakers
                    intervention</strong> through Missed-dose Dispense. Hence, displaying data of Missed-dose
                Dispense together with adherence acts as a crucial feedback to users by providing an
                <strong>integrated view of their behavioural patterns</strong>. This, in turn, could facilitate
                positive adjustments in future user behaviours. Indeed, some of the questions asked by caretakers
                gathered in the user research sought information that implies such underlying sentiments.
            </p>

            <p><strong>Overlaying variables</strong> is doubled-edged in that it can help users to understand the
                data through visual comparison but also create confusion by <strong>adding complexity</strong> to
                the graph. Therefore, it is essential to include interactive functions such as <strong>selective
                    turn off or on</strong> the variables; adding a <strong>data label</strong> feature that
                summarises all the variables at a specific time point is another important way to help users make
                sense of the axes of the graph.</p>

            <VideoPoster :poster="img5" :video-src="vid5" alt="Adherence trend" />

            <h3>Design for accessibility</h3>
            <p>Consistent with the rest of the product, conscious efforts have been made to optimise the design
                according to WCAG criteria of accessibility. For example, to improve
                <strong>distinguishability</strong>, <strong>colour contrast</strong> for text and graphics were
                audited using WebAIM and adjusted to meet <strong>WCAG 2.1 AA</strong>. <strong>Borders</strong>
                were used at times to improve accessibility of graphics if the colour contrast deemed insufficient.
                <strong>Interactive dynamic features</strong> were incorporated in charts to enable dataset
                isolations for clarity. For <strong>understandability</strong>, <strong>data labels</strong>
                containing the data point's value were provided alongside chart graphics so that data clarity is not
                reliant solely on the plotting style. Alongside text labels, it is also ensured that there is a
                consistent association between <strong>categorical variables</strong> and <strong>distinctive
                    colours</strong> within the constraints of the colour palette. This not only provides interface
                consistency but it can also greatly improve the <strong>efficiency of data comprehension</strong>
                for users. For users without significant colour vision deficiencies, colour can accelerate pattern
                recognition as it actively exploits human brain's ability to <strong>process colours</strong> much
                <strong>faster than words</strong>. It is important to note that we find such approach effective in
                this particular context due to the limited number of categories. Therefore, the upfront cost of
                cognitive load required to establish colour-concept associations is outweighed by the subsequent
                benefit. Overall, <strong>multiple graphic and text indicators</strong> were used to present
                information to improve accessibility.
            </p>

            <h3>Chunk by purpose</h3>
            <p>We realised early on at the discovery stage that the goals users have in mind when engaging dashboard
                can be divided into two categories of purpose: 1) to gain insights on clients' performances or
                behaviours; 2) to get updates about users and Kindo for the smooth operation of the IoT platform.
                Therefore, there was a need to make a clear division of contents to optimise the process of
                accessing relevant information. This had evolved to the use of a retractable sidebar to contain
                widgets related to platform updates - a feature that is distinct from the dashboard but can be
                visually integrated to be a part of it. The enforced perceptual grouping by creating boundaries
                between the two sets of content makes clear their purposes. Thus, minimising friction in the
                information seeking process. Furthermore, the sidebar functions allow easy access for quick updates.
                It also allows for high refresh rate specifically for this section for accessing the latest data;
                together with auto-refresh with scroll, as well as user directed refresh through a button. Conscious
                efforts has been made to ensure the content of platform updates only provides important snippets -
                not to overshadow the functions of other relevant features where more detailed information can be
                found.</p>

            <VideoPoster
                :poster="img6"
                :video-src="vid6"
                alt="Missed Dose Insights"
                caption="Prototype of Missed Dose Insights"
            />

            <VideoPoster :poster="img7" :video-src="vid7" alt="Caregiver dashboard" />
        </section>

        <section>
            <h2>Result</h2>
            <p>The product displayed here was a crucial part of the company's pitch to investors. It was very well
                received, displaying a clear consideration of the <span class="highlight">specifics</span> of the
                healthcare sector and an attention to the user's needs.</p>
            <p>Within the test group that we ran, all of the users indicated satisfaction with the UX and visual
                aspect of the prototype. There was a keenness to explore the dashboards, and they felt that this
                level of personalisation could only be achieved by <span class="highlight">sector-specific</span>
                companies such as our own.</p>
            <p>From an engineering perspective, the prototypes I provided set a clear path for backend and engineers
                to develop the app, well integrated with the hardware solution. This was made possible by the
                attention not only to visual aspects, but the full user life cycle as well as data consideration,
                <span class="highlight">serving practicalities and concrete hardware capabilities</span>.
            </p>
        </section>

        <section>
            <h2>Reflection</h2>
            <p>Analytical plan / rewrite content here</p>
        </section>
    </ProjectDetail>
</template>

<script>
import ProjectDetail from './ProjectDetail.vue'
import ZoomableImage from '../components/ZoomableImage.vue'
import VideoPoster from '../components/VideoPoster.vue'
import img0 from '../assets/medication-dashboard/0_dashboard_hero.jpg'
import svg1 from '../assets/medication-dashboard/1_affinity_interrelation_large_margin_portfolio.svg'
import img2 from '../assets/medication-dashboard/2_primary_user_vs_caregiver_dashboard_portfolio.jpg'
import img3 from '../assets/medication-dashboard/3_colour_system_portfolio.jpg'
import img4 from '../assets/medication-dashboard/4_dispense_summary_portfolio.jpg'
import img5 from '../assets/medication-dashboard/5_adherence_trend_portfolio.jpg'
import img6 from '../assets/medication-dashboard/6_missed_dose_insights_portfolio.jpg'
import img7 from '../assets/medication-dashboard/7_caregiver_dashboard_portfolio.jpg'
import vid5 from '../assets/medication-dashboard/5_adherence_trend.mov'
import vid6 from '../assets/medication-dashboard/6_missed_dose_insights.mov'
import vid7 from '../assets/medication-dashboard/7_caregiver_dashboard.mov'

export default {
    name: 'MedicationDashboard',
    components: { ProjectDetail, ZoomableImage, VideoPoster },
    data() {
        return { img0, svg1, img2, img3, img4, img5, img6, img7, vid5, vid6, vid7 }
    },
}
</script>
