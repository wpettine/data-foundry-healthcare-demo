# Overview

We are creating a new walk-through demo that we can show to potential clients and funders. The functionality needs to be demonstrated, but does not need to be real.

## General Objectives

- Audience understands business value created for a single kind of customer
- Audience appreciates the technical foundations of the product

## Business applications

- Denial rates and payer concentration across sites
    - From the PE demo
- Assembly of patient key information for submission of insurance claims
    - The text says that the patient needs to have done a procedure that is commonly denied. Select information is gathered across multiple sources to support that procedure.
- Assembly of features for in-house ML and for use in AI systems.
    - User describes the type of model they want to create. The user asks for one that predicts CHF exacerbation.
    - Prompt asks the user if the system should suggest features.
    - System combs through the medical literature, suggests a set of features.
    - The user approves.
    - System combs through all the data sources, assembling those features for training.

## Technical side

- Schema annotation
    - Specific example from the health M&A hold-period integration
- Cross-database concept linkage
    - Example from the health M&A example
- AI-assisted annotation of clinical histories and time series
    - The interface identifies the earliest potential time the CHF exacerbation could have been detected for intervention, and suggests labels.
- Maintenance of semantic integrity over time.
    - Data pipeline checks.
