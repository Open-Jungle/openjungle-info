![JungleEx](https://ipfs.io/ipfs/QmSqktoxt6VagJt7azEmxCqKm8C7GbyjWeaREEeFbvvGtz "Logo Title Text 1")

Welcome to the WorkPaper
---
**Goal of the project:**

Create a self governing Dapp to group DeFi products in a single easy-to-use and professional looking interface. It will generate money by offering launching services to token developers and charging fees to users.

**Proposed roadmap:** 
1. Team building.   <
2. Specifications.  <
3. Development.
4. Alpha releases of the platform.
5. Seek financial support and marketing teams for our pre launch campaign.
6. Pre-Launch campaign.
7. Official white paper of the governance.
8. Private sale to investors and partners.
9. Public presale of the governance tokens.
10. Audits.
11. Full release. (audited version)
12. Governance update. (Supervised)
13. Ownership renouncement. (Full decentralization)

Proposed Workflow
-----------------
This is how I envision the iterative process of developement. I am not inventing anything here and simply try to adapt the agile methodologies to a decentralized group. Keep in mind this is just a first pitch, there must be some flaws and problems, you are welcome to suggest improvements and modifications.

It will start with an initial draft that describes in medium detail how I think it should work and what are the steps to reach a final product. It will stay on github where anyone can branch off and propose an updated version. We can then upgrade versions until we have a good idea of our next step. This specification document will represent the ground truth regarding the specifications and steps of the project. 
 
At any time along the execution of the steps, if an ambiguity or uncertainty arises from the interpretation of the specification, we should stop what we are currently working on and go back to the specification in order to clarify it.

**To contribute,** clone this file, branch, make the modifications you want and add your ideas. Then simply make a pull request and I will accept it.

How to start
------------
**To look at demo**  
There is a bsc testnet demo running [here](https://jungleex.netlify.app/)  
You must have MetaMask on to access the demo exchange.

If you want coins to experiment with the demo just send me a dm at @LiquidBlocks on telegram. A beter solution will be created later.

**To start editing**
1. Start by cloning the repo
2. Navigate to the App folder
3. Run install
4. Start a server
```
git clone https://github.com/FredCoteMtl/JungleEx
cd jungleex-frontend
npm install
npm start
```
At this point you should see the landing page of the app.

SPECIFICATIONS
==============
*Last update: 2021-08-06  
Specifications Version: 1
Note: A lot more information is needed to create a complete plan, keep in mind this is a first version.*

The Jungle exchange is built in 4 separate parts interacting with each other. 
1. Solidity Jungle Exchange Contract Collection.
2. Solidity Governance contracts. 
3. React Frontend.
4. IPSF Storage.

These four components together create the fully decentralized order book exchange.

JungleEx Contract Collection
---
These are the backbones of our Dapp, all the payments will be handled by the blockchain. For now it consists of: 
1. The pancake swap contracts and interfaces.
2. The p2p order book contract.
3. The Launchpad contract.
4. Collection of Openzeppelin standards

Governance Contract
---
The governance contract is used by the community to accept or reject coins from the exchanges launchpad. It will also serve to participate early in launchpools and other exclusive rewards. 

*Governance is not necessary and is unsafe for the alpha release. It should only be implemented after the platform has been audited.*

Frontend
---
The frontends main task is to display the information from a bunch of contracts. The problem is it can not know what contracts exist and what are the address without something telling it. If we simply encode these in our frontend it would then become a centralized application. Then, the process to fetch the information directly from the blockchain is slow and would not be pleasing for a user. 

That’s why I propose to make it first fetch from a trusted decentralized source source then validate the information against the chain. The decentralized source will be voted by the holders of the governance tokens.

Note that this way the frontend has absolutely no influence on the mechanism of the exchange and contains no sensible information.

IPFS Off-chain Storages
---
The off chain order book is simply a bunch of files on the IPFS system. These files contain the contracts address and latest logs of the blockchain but condensed in a quick access format. It will be immutable since IPFS stores data according to their hash. Periodically, the files will be updated and a new hash will be accepted and verifiable by the community. Anyone trying to affect that file with bad intentions would change its hash and alert the community. 

The scrapper used to extract the logs from the blockchain is also considered a part of this component. 

The last part of this IPFS storage section is the information for the charts on our exchange and a list of the valid currencies.

Propositions For Next Step
===
#### Prop. 1  
I think we should first make sure to agree on the general theme of the site. Like the color palete, nav bar, footer.. things thats doesnt really change with the content. As I said, im not an artist and will trust you for the disposition of the different pannels. off course I do like the green style I chose up to now and the logo but if you have something better im open to change.

I personnaly think its difficult to take someones project and start from there, also my demo is very messy for now and you would probably not have a good time trying to restyle and move things around. It is probably faster to make brand new components.

So I propose we start again from the ground up, make everything according to a nice theme and make sure to not have any laggy components. Then the blockchain related code that I have in the demo can easily be merged into the new frontend.

#### Prop. 2  
Make a clear plan for the distribution of the project's value. It is important to know how the final value of the project will be distributed. 
- What percentage of the governance tokens will go to the team and how many fees can they take ?
- What is the percentage of revenue going for marketing ?











