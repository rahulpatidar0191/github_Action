/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 731:
/***/ ((__unused_webpack_module, __webpack_exports__, __nccwpck_require__) => {

"use strict";
// ESM COMPAT FLAG
__nccwpck_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ../../../AppData/Roaming/npm/node_modules/@vercel/ncc/dist/ncc/@@notfound.js?@actions/core
var core = __nccwpck_require__(389);
// EXTERNAL MODULE: ../../../AppData/Roaming/npm/node_modules/@vercel/ncc/dist/ncc/@@notfound.js?@actions/github
var _notfound_actions_github = __nccwpck_require__(977);
;// CONCATENATED MODULE: ./pr-title-checker-config.json
const pr_title_checker_config_namespaceObject = JSON.parse('{"LABEL":{"name":"Gitmoji missing","color":"EEEEEE"},"CHECKS":{"prefixes":["🎉",":tada:","🔖",":bookmark:","👥",":busts_in_silhouette:","📄",":page_facing_up:","✨",":sparkles:","👽️",":alien:","🚚",":truck:","🏗️",":building_construction:","🔧",":wrench:","🔨",":hammer:","💥",":collision:","🗃️",":card_file_box:","👔",":necktie:","🛂",":passport_control:","🐛",":bug:","🚑️",":ambulance:","🚨",":rotating_light:","✏️",":pencil2:","🔒️",":lock:","🩹",":adhesive_bandage:","➕",":heavy_plus_sign:","➖",":heavy_minus_sign:","⬇️",":arrow_down:","⬆️",":arrow_up:","📌",":pushpin:","🎨",":art:","⚡️",":zap:","♻️",":recycle:","🔥",":fire:","⚰️",":coffin:","🥅",":goal_net:","🗑️",":wastebasket:","💡",":bulb:","🧑‍💻",":technologist:","🚸",":children_crossing:","📱",":iphone:","🍱",":bento:","♿️",":wheelchair:","💄",":lipstick:","💫",":dizzy:","👷",":construction_worker:","💚",":green_heart:","🚀",":rocket:","🩺",":stethoscope:","🧱",":bricks:","🙈",":see_no_evil:","⏪️",":rewind:","🔀",":twisted_rightwards_arrows:","📝",":memo:","✅",":white_check_mark:","🌐",":globe_with_meridians:","💬",":speech_balloon:","🔊",":loud_sound:","🔇",":mute:","🏷️",":label:","🧪",":test_tube","📈",":chart_with_upwards_trend:","🧐",":monocle_face:","🌱",":seedling:"],"ignoreLabels":[" "]},"MESSAGES":{"success":"All OK","failure":"Failing CI test","notice":""}}');
;// CONCATENATED MODULE: ./index.js


const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");
const issue_number = _notfound_actions_github.context.issue.number;
//const configPath = process.env.INPUT_CONFIGURATION_PATH;
const passOnOctokitError = process.env.INPUT_PASS_ON_OCTOKIT_ERROR === "true";
const { Octokit } = __nccwpck_require__(386);


let octokit;

// most @actions toolkit packages have async methods
async function run() {
  try {
    const title = _notfound_actions_github.context.payload.pull_request.title;
    const labels = _notfound_actions_github.context.payload.pull_request.labels;

    let config;
    try {
      //config = await getJSON(configPath);
      config = pr_title_checker_config_namespaceObject
    } catch (e) {
      core.setFailed(`Couldn't retrieve the config file specified - ${e}`);
      return;
    }
    let { CHECKS, LABEL, MESSAGES } = JSON.parse(config);
    LABEL.name = LABEL.name || "Gitemoji missing";
    LABEL.color = LABEL.color || "eee";
    CHECKS.ignoreLabels = CHECKS.ignoreLabels || [];
    MESSAGES = MESSAGES || {};
    MESSAGES.success = MESSAGES.success || "All OK";
    MESSAGES.failure = MESSAGES.failure || "Failing CI test";
    MESSAGES.notice = MESSAGES.notice || "";

    if(title.toLowerCase().includes("feature")){
      pullRequest.title =  '🎉' + pullRequest.title
    }
    if(title.toLowerCase().includes("fix")){
      pullRequest.title =  '🐛' + pullRequest.title
    }

    for (let i = 0; i < labels.length; i++) {
      for (let j = 0; j < CHECKS.ignoreLabels.length; j++) {
        if (labels[i].name == CHECKS.ignoreLabels[j]) {
          core.info(`Ignoring Title Check for label - ${labels[i].name}`);
          removeLabel(labels, LABEL.name);
          return;
        }
      }
    }

    try {
      core.info(`Creating label (${LABEL.name})...`);
      let createResponse = await octokit.issues.createLabel({
        owner,
        repo,
        name: LABEL.name,
        color: LABEL.color,
      });
      core.info(`Created label (${LABEL.name}) - ${createResponse.status}`);
    } catch (error) {
      // Might not always be due to label's existence
      core.info(`Label (${LABEL.name}) already created.`);
    }
    if (CHECKS.prefixes && CHECKS.prefixes.length) {
      for (let i = 0; i < CHECKS.prefixes.length; i++) {
        if (title.startsWith(CHECKS.prefixes[i])) {
          removeLabel(labels, LABEL.name);
          core.info(MESSAGES.success);
          return;
        }
      }
    }

    if (CHECKS.regexp) {
      let re = new RegExp(CHECKS.regexp, CHECKS.regexpFlags || "");
      if (re.test(title)) {
        removeLabel(labels, LABEL.name);
        core.info(MESSAGES.success);
        return;
      }
    }

    await titleCheckFailed(CHECKS, LABEL, MESSAGES);
  } catch (error) {
    core.info(error);
  }
}

async function titleCheckFailed(CHECKS, LABEL, MESSAGES) {
  try {
    if (MESSAGES.notice.length) {
      core.notice(MESSAGES.notice);
    }

    await addLabel(LABEL.name);

    if (CHECKS.alwaysPassCI) {
      core.info(MESSAGES.failure);
    } else {
      core.setFailed(MESSAGES.failure);
    }
  } catch (error) {
    core.info(error);
    if (CHECKS.alwaysPassCI) {
      core.info(`Failed to add label (${LABEL.name}) to PR`);
    } else {
      core.setFailed(`Failed to add label (${LABEL.name}) to PR`);
    }
  }
}

async function addLabel(name) {
  core.info(`Adding label (${name}) to PR...`);
  let addLabelResponse = await octokit.issues.addLabels({
    owner,
    repo,
    issue_number,
    labels: [name],
  });
  core.info(`Added label (${name}) to PR - ${addLabelResponse.status}`);
}

async function removeLabel(labels, name) {
  try {
    if (
      !labels
        .map((label) => label.name.toLowerCase())
        .includes(name.toLowerCase())
    ) {
      return;
    }

    core.info("No formatting necessary. Removing label...");
    let removeLabelResponse = await octokit.issues.removeLabel({
      owner,
      repo,
      issue_number,
      name: name,
    });
    core.info(`Removed label - ${removeLabelResponse.status}`);
  } catch (error) {
    core.info(`Failed to remove label (${name}) from PR: ${error}`);
  }
}

async function getJSON(repoPath) {
  const response = await octokit.repos.getContent({
    owner,
    repo,
    path: repoPath,
    ref: github.context.sha,
  });

  return Buffer.from(response.data.content, response.data.encoding).toString();
}

async function handleOctokitError(e) {
  core.info(`Octokit Error - ${e}`);
  if (passOnOctokitError) {
    core.info("Passing CI regardless");
  } else {
    core.setFailed("Failing CI test");
  }
}

try {
  octokit = new Octokit();
} catch (e) {
  handleOctokitError(e);
}

if (octokit) {
  run();
}

/***/ }),

/***/ 389:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 977:
/***/ ((module) => {

module.exports = eval("require")("@actions/github");


/***/ }),

/***/ 386:
/***/ ((module) => {

module.exports = eval("require")("@octokit/action");


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__nccwpck_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module doesn't tell about it's top-level declarations so it can't be inlined
/******/ 	var __webpack_exports__ = __nccwpck_require__(731);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;