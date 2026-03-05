const Jasmine = require('jasmine');
const { SpecReporter } = require('jasmine-spec-reporter');

const runner = new Jasmine();
runner.clearReporters();
runner.addReporter(new SpecReporter());
runner.loadConfigFile('jasmine.json');
runner.execute();
