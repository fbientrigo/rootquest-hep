
ROOT Quest

Interactive ROOT (language)and High Energy Physics (HEP) analysis learning through exploration.

ROOT Quest is an experimental learning environment for physics students beginning with ROOT and high-energy physics data analysis.

Instead of starting from API calls and notebook cells, learners first manipulate events, make selections, observe distributions, and predict what their choices will do.

ROOT code appears after the underlying idea has become tangible.

Learning model

Manipulate → Observe → Predict → Code

The goal is not to replace ROOT documentation.

ROOT Quest should make learners better prepared to understand and use it.

First experience: Higgs Hunt

The first vertical slice teaches the basic analysis loop through a small Higgs search.

Learners will progressively:

- inspect collision events and reconstructed particles;
- keep or reject events;
- apply simple cuts;
- observe selections changing in real time;
- construct and read an invariant-mass distribution;
- look for an excess near the Higgs mass;
- connect those actions to equivalent ROOT analysis code.

The objective is not to teach every ROOT API.

It is to build the mental model behind the analysis.

Project principles

- Simple implementation, rich learning experience.
- Native web capabilities before additional machinery.
- Immediate cause-and-effect feedback.
- Visualization for understanding, not decoration.
- Gamification that rewards useful reasoning.
- Accessibility as part of correctness.
- Physics and ROOT behavior grounded in authoritative sources.
- One polished vertical slice before generalized infrastructure.

Status

Early prototype.

The current focus is the Higgs Hunt vertical slice and the minimal reusable foundations required to support it.

Scope

ROOT Quest is a learning companion, not:

- a ROOT reference manual;
- a notebook replacement;
- a full analysis framework;
- a detector simulation;
- a general-purpose learning management system.

Project structure

Product, learning and engineering decisions are documented under "docs/".

Technical stack, versions and browser/build constraints are defined separately in "STACK_CONTRACT.md".

Independence

ROOT Quest currently explores an independent educational approach built around ROOT and HEP analysis.

This is not an official ROOT or CERN project. 
I'm doing this to learn and share. 