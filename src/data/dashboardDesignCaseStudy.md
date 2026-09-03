# IoT Adherence Analytics for Caregivers

**Client:** KIN  
**Period:** 2026

## Summary

- **Sole designer** – 0-to-1 design of a customer-facing dashboard of the web app of an IoT medication platform.
- **Turned user research into architecture** – Identified two sets of user needs (behavioural insights + operational status) to drive the dashboard layout.
- **Anticipated and visualised complex data** – Defined data requirements before data pipeline existed. Translated logs, events, and device statuses into simple data visualisation.
- **Achieved user validation and investor buy-in** – Delivered pitch-ready prototype with 100% user satisfaction in interview feedback sessions.

## The Challenge

Kin is a healthcare startup that needed to showcase the full digital experience of its product to secure **future investments and partnerships**, particularly in **healthcare sectors**. One thing we wanted to demonstrate in pitches is how **user data** collected from our **IoT medication adherence platform** can be transformed into **easy‑to‑digest insights for caregivers** – helping them better understand their clients' behavioural patterns and providing **better quality of care with less effort**. The task given was to design a **caregiver‑facing dashboard** for the primary user's account within the web app that would help them better understand and assist their client.

## My role

Sole designer on this project. Reported directly to the head of product.
Responsible for:

- **UX**
- **UI**
- **User research**
- **Product strategy**
- **Problem framing**
- **Stakeholder communication**
- **Data visualisation**
- **Design system**
- **Prototyping**

## Problem framing

### 1. Identify the scope of content

The caregiver user group here and their corresponding business context provide an important **constraint** on the type of dashboard to aim for – a **slightly data-rich consumer dashboard**. In order to identify the scope of content relevant to such a dashboard, I turned to the **user research** material available at hand. Taking a holistic approach, I summarised the findings in a **hybrid affinity-interrelationship diagram** by synthesising **user interview insights** with **product features**, encompassing details on functionality, primary user datasets, metrics, and end user needs. This helped to identify dashboard contents that are most relevant to our users

Although the project was set out to mainly show **simple adherence-related analytics** for caregivers, the **analysis** revealed **two main expectations** on the functionality of the dashboard:

- **Behavioural insights of primary user**
- **Quick access to the key operational statuses** such as the remote device status and medication stock.

The first point was anticipated. The second point makes sense in hindsight – as the dashboard is the home screen, users would expect to find **operational information** there also. These two expectations became both the **rationale and the blueprint** for a layout that **separates components by function.**

*Hybrid affinity-interrelationship diagram based on user research findings*

### 2. Define the narrative

With the framework set, I turned to the **narrative**. Without a strategic narrative, users can experience fatigue or miss key insights. It is also an opportunity to **highlight and reinforce features** that contribute to the product's value proposition. For example, the primary user's mobile app that I had previously designed functions as a **progress hub** at the home screen. It has a narrative of ***encouragement*** that uses simple data presentation to trigger immediate impression – cumulative adherence appears as a **heart-shaped progress graphic** leveraging the **cognitive tension from unfinished tasks**; a dispense **streak** leverages **loss aversion**. Both encourage adherence behaviour.

For the caregiver dashboard, a narrative of ***synopsis*** is needed, providing **feedback across the three-part system** of caregiver, client and the IoT platform to drive **positive actions** that help improve the clients’ medication adherence. For example, having a daily adherence trend that also shows missed doses that were later compensated by an ad hoc dispense; a chart showing when missed doses most often occur.

Based on user research, although the caregivers have more **ability** to explore data than their clients, they do not necessarily have the time for lengthy data discovery in their daily work. Therefore, while they can handle multivariate plots, the data visualisation should be simple, highlight **straightforward patterns and trends**, and show a **limited number of widgets** compared to typical analytical dashboard.

## Design highlights

### 1. Prompts for stakeholders and AI

I began by **sketching a range of data visualisation widgets** without worrying about screen layout. Some charts were discarded early; others moved into **high‑fidelity wireframes and prototypes**. This allowed the best solutions to emerge before I committed to composition. It also gave me **early artifacts** to share with stakeholders, **speeding up iterations**.

In my design workflow, I also used these wireframes as **image prompts** in **Figma Make** to generate mockups. I reasoned that while the **AI-generated artifacts** were far from production-ready, they could **accelerate decision-making** by serving as a crude baseline for **design audits**. The process helped me identify reusable **UI ideas** and potential **friction points** before diving into high-fidelity prototyping.

*Wireframes for the caregiver-facing dashboard's widgets juxtaposed with mockups of the primary user's mobile dashboard*

### 2. Design for accessibility

Working within the constraints of the existing design system, I updated the colour system of the product by **adding new accent colours** to accommodate the dashboard design. Consistent with the rest of the product, I improved accessibility the design according to **WCAG**.

To improve distinguishability, I **audited** colour contrast for text and graphics was using **WebAIM** and adjusted to meet WCAG 2.1 AA. When colour contrast was deemed insufficient, I used **borders** to improve accessibility of graphics. **Interactive dynamic features** were incorporated in charts to enable **isolating datasets** for clarity.

I also ensured there is a **consistent association between categorical variables and colours used**. This not only important for visual coherence across the interface but can also improve data comprehension as the **human brain processes colours much faster than words**.

To improve understandability, I included **interactive data labels** for the chars so that comprehension is not solely reliant on plotting style. This is also crucial for **accessibility** of those with **colour vision deficiency**.

*Colour palettes for the dashboard design with colour contrast audit for WCAG compliance*

### 3. Optimising visual perception for the narrative

To **optimise comprehension** of multivariate data, I prioritised **familiar chart types**, such as bar, pie, and line, as they are already stored in our collective psyche. Nonetheless, choosing the suitable graph for a particular dataset requires **holistic consideration** of the context, narrative, aesthetics, and practical UX.

For example, it is feasible to present the summary of the type and punctuality of dispenses, which are made up of distinct data categories, in either a bar chart, pie chart, or donut chart. The goal of this particular data visualisation is to **show the proportions of the categories in order to highlight edge cases**s, some of which are undesirable behaviour outcomes of primary users. A priori, with optimal usage of our product, I anticipated that the dataset would be **heavily skewed towards one category**. In this case, the **circular chart type trumps the bar chart** for two reasons:

- It avoids the impression of incomplete data when the dataset is dominated by one category since the visual nature of a circular chart leaves **no empty spaces**. Thus, it provides a more **compact and harmonious visualisation** than a bar chart.
- It makes edge cases far more visually striking since they are presented as **elements that disrupt** a circle. In combination with high contrast colours, it is highly effective for highlighting edge cases that need attention.

Therefore, circular charts are more aligned with the narrative we aimed for. As to whether a pie or donut chart is preferred, the **donut** has the advantage of enabling better perception of the proportions of the wedges: the **human brain is biased toward reading lengths (the arc) more accurately than areas or angles.**

*Design iterations of Dispense Summary*

### 4. Integrating multiple variables without losing clarity

**Adherence** is the most important KPI of the product for users. Although a **single‑number cumulative average** is an impactful quick overview, a **daily trend** is highly informative. It helps track the primary user's performance in **real time** and reveal behaviour patterns. Crucially, in our product, adherence is not just the result of the primary user's interaction with the IoT platform. **Caregiver intervention via remote ad‑hoc dispense** of missed dose (Missed‑dose Dispense) also influences the adherence outcome. Showing both together gives users an **integrated view of behaviour** which also directly addresses needs that emerged in user research, helping caregivers identify when their **intervention changes the adherence outcome**.

However, **overlaying variables is double edged**. The visual comparison helps users, but the complexity can be confusing. I addressed this by adding toggles that allow users to **isolate the variables** they wished to display. I also included a **hover-activated data label** that summarises all variables at a specific time point to **eliminate guesswork**.

*Designs of Adherence Trend and Missed Dose Insights widgets*

### 5. From logs to insights

I have also **anticipated the log data** that can be used to generate insights on client behaviour. For example, the caregivers wanted to know more about **when their clients usually miss medications**. The answer to this is **twofold**. The features of the IoT system enable missed doses from a previously scheduled dispense (Scheduled Dispense) to be **compensated later** via an ad-hoc dispense (Missed-dose Dispense) within a pharmacologically suitable timeframe. Therefore, it is feasible for a scheduled dispense event to have a final status of *dispensed* with a **historical status** of *medications missed*. Thus, the **initial missed doses do not always correspond to the final missed doses**. To provide behaviour insights, **both the datasets are of equal importance**. I therefore needed to present them both together in a way that allows users to perceive their relationship and differences with **minimal cognitive effort**.

**Interactivity** plays an important role. A simple **toggle** that allows users to isolate the two datasets would enable them to **intuitively learn their relationship**. Since I’m introducing to the users a **new concept** around missed-dose data – gross missed doses that have not been corrected by compensatory Missed-dose Dispense – it is important to clarify it by including expandable tooltips.

In terms of data visualisation, to help simplify the presentation of time, I have divided a day into **six bins**. This also has the advantage of being **aligned with typical human daily routines**. To help users get **a sense of proportion** of the missed doses, I used Scheduled Dispense data as a **baseline backdrop** for comparison. Although the simplicity of the data visualisation should speak for itself, it is useful to explicitly spell out the insights. I included **dynamic descriptive text** that highlights key takeaways and updates based on the datasets isolated by users.

Crucially, the juxtaposition of the two datasets has also helped highlight the positive effect of **caregiver intervention** on clients’ adherence **via our IoT system**.

### 6. Divide and conquer

Earlier in discovery, I identified **two distinct user goals** when engaging with the dashboard:

- **Gaining insights into client behaviour** - this consists of widgets of data visualisation of processed user data. They are providing **longer-term feedback** to the users. The analysis timeframe is often of scale from **a week to months**.
- **Checking key operational statuses** - this consists of widgets of status report such as snippets of latest events, the conditions of the remote device, medication stocks. They are **real-time feedback**.

Therefore, these two goals required a **clear division of content** to minimise **friction for both the users and the system.**

I addressed this by introducing a **retractable sidebar** to contain operational status widgets – a feature that is distinct from the dashboard but visually integrated as part of it. The enforced **perceptual grouping**, as the result of creating boundaries between the two sets of content, makes their distinct purposes immediately clear.

Given the time sensitive nature of the sidebar content, this isolated section supports a **higher auto-refresh rate** than the rest of the dashboard, so users always see the latest operational data. In the edge case of connection lost, a **timestamp** appears to clarify that the data is not live, helping instil **user confidence** in the application's reliability.

I also took care to keep the sidebar content **concise**, showing only important snippets so they don't overshadow the main app features where users can find more detailed information.

*Caregiver-facing dashboard demo*

## Results

The dashboard design was a **crucial part of the company's investor pitch**, demonstrating how IoT data could be translated into easily digestible and actionable insights for caregivers. It was **well received by investors**, who noted clear consideration of the specific **context of the healthcare sector** and attention to the target **user's needs.**

In an **interview feedback session** with a small group of caregivers all participants **responded positively** to the design. The **clarity of the data presentation** was specifically highlighted. Most found the layout **easy to comprehend and navigate**. A few noted that a simple product tour could be beneficial given the number of widgets present. The design was also successful in highlighting features that contribute to the IoT product's **value proposition**, in particular the **remote dispense function**, which caregivers are primary users. In general, the caregivers felt that the product feature would help **improve the quality of care** that they can deliver by **lowering the effort** required for monitoring and understanding their clients' behaviours.

From an **engineering perspective**, the prototypes established a clear path for **backend data structure and integration with the hardware solution**. This was made possible by the attention not only to visual aspects, but to the **user lifecycle, data requirements and hardware constraints**.

Overall, the project succeeded in achieving its **0‑to‑1 objectives**, considered both **business and user needs**, and laid the groundwork for **subsequent design and development initiatives**.

## Reflection

This 0‑to‑1 initiative delivered polished, high‑fidelity prototypes that piqued investor interest and demonstrated product viability. Looking back, there are a few things I would **approach differently**. Although it was essential to produce some visually polished prototypes as quickly as possible for demo purposes in pitches, I would have taken more time to **better define the interaction logic** of the modules at the **low‑fidelity stage**. This would have allowed for **faster iteration** on interaction without being bogged down by pixels. While a comprehensive suite would not be feasible at this 0‑to‑1 stage, **lean documentation** capturing key design decisions, such as data considerations, accessibility, UI states, and interaction specs, would provide a clearer **foundation for the next phase** of development.

For future development, **customisation** and **personalisation** could bring value to the product:

- *Usability testing for enterprise customisation*

  The feedback session validated the core design, but **structured usability testing** is crucial for the next phase. A reality check would allow us to evaluate how well the dashboard fits with the workflows of the caregiving enterprise, and thus helps determine the requirements of subsequent iterations depending on the customers' needs.
- *Data-driven personalisation*

  Pushing the UX boundaries, an **adaptive UI** can be implemented in future iterations; automatically reconfigure the dashboard based on **tracked engagement data**, surface high engagement widgets, and deprioritise those with lower engagement. The **feedback loop** between behavioural data and interface design allows the dashboard to become more **personalised**, giving the product a **competitive edge**.
