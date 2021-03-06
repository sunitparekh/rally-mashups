YUI.add('mashups-test-data',function(Y){
    Y.namespace('Mashups.Tests.Data');

    Y.Mashups.Tests.Data.DefectsAsData = new Array(
    {
        ObjectID: 325507112,
        FormattedID: "DE1385",
        Name: "REGRESSION ISSUE : Job of type \"Remove Design from Construction View\" is running continuously.",
        Owner: "ian.newcombe@ge.com",
        Blocked: true,
        PlanEstimate: null,
        Rank: 289.838,
        ScheduleState: "In-Progress",
        KanbanState: "In Development"
    },{
        ObjectID: 324652308,
        FormattedID: "DE1002",
        Name: "DM: Unable to set up the property definition_module_name for dlt_list_plugin plugin.",
        Owner: "venugopal.reddym@ge.com",
        Blocked: false,
        PlanEstimate: 2.0,
        Rank: 289.913,
        ScheduleState: "In-Progress",
        KanbanState: "Ready For Test"
    },{
        ObjectID: 324170706,
        FormattedID: "DE857",
        Name: "Internal name is displayed for Job Region instead of 'Send Joins to Explorer' and clicking on this doesn't export anything to explorer window-djb",
        Owner: null,
        Blocked: false,
        PlanEstimate: 2.0,
        Rank: 5290.662,
        ScheduleState: "In-Progress",
        KanbanState: "Ready For Test"
    },{
        ObjectID: 325373522,
        FormattedID: "DE1291",
        Name: "REGRESSION ISSUE : TBK Error is received while accessing DLT's",
        Owner: "ian.newcombe@ge.com",
        Blocked: false,
        PlanEstimate: 5.0,
        Rank: 292.909,
        ScheduleState: "In-Progress",
        KanbanState: "Ready For Code Review"
    },{
        ObjectID: 324298394,
        FormattedID: "DE898",
        Name: "CRD CBG00130781: [eng] Infinite loop if swg_merge.ds is hard_readonly",
        Owner: "steve.canavan@ge.com",
        Blocked: false,
        PlanEstimate: 5.0,
        Rank: 870.491,
        ScheduleState: "In-Progress",
        KanbanState: "In Code Review"
    });

    Y.Mashups.Tests.Data.StoriesAsData = new Array(
    {
        ObjectID: 325594710,
        FormattedID: "US10266",
        Name: "DM metods that can potentially part of core should be moved to core or at least placed in generic DM module.",
        Owner: "tajuddin.baig@ge.com",
        Blocked: false,
        PlanEstimate: null,
        Rank: 8.596,
        ScheduleState: "Backlog",
        KanbanState: "Defined",
        Iteration: {Name: "Sprint 1", ObjectID: 321905964, StartDate: "2009-01-01T00:00:00.000Z", EndDate: "2009-06-11T23:59:59.000Z"}
    },{
        ObjectID: 324377497,
        FormattedID: "US8089",
        Name: "IRD CBG00130411 : Able to add the RWOs and Points and spans to the design at intermediate state",
        Owner: "raja.budaraju@ge.com",
        Blocked: false,
        PlanEstimate: 1.0,
        Rank: 288.348,
        ScheduleState: "In-Progress",
        KanbanState: "In Development",
        Iteration: null
    },{
        ObjectID: 325484197,
        FormattedID: "US10077",
        Name: "Spike : DM changes with respect to core changes to conflict viewer",
        Owner: "ian.newcombe@ge.com",
        Blocked: false,
        PlanEstimate: 0.0,
        Rank: 307.048,
        ScheduleState: "In-Progress",
        KanbanState: "Funny Value"
    },{
        ObjectID: 321913223,
        FormattedID: "US1451",
        Name: "Always aware if my design is in a design set",
        Owner: "manisha1.sharma@ge.com",
        Blocked: false,
        PlanEstimate: 3.0,
        Rank: 2.292,
        ScheduleState: "Accepted",
        KanbanState: null
    },{
        ObjectID: 324284156,
        FormattedID: "US7766",
        Name: "Designer can publish COs to as built",
        Owner: "sunilkumar.siddamshetty@ge.com",
        Blocked: false,
        PlanEstimate: 3.0,
        Rank: 310.04,
        ScheduleState: "Completed",
        KanbanState: ""
    });

    Y.Mashups.Tests.Data.Cards = function() { return new Y.Mashups.Cards()
            .addCard(new Y.Mashups.Story(Y.Mashups.Tests.Data.StoriesAsData[0]))
            .addCard(new Y.Mashups.Story(Y.Mashups.Tests.Data.StoriesAsData[1]))
            .addCard(new Y.Mashups.Story(Y.Mashups.Tests.Data.StoriesAsData[2]))
            .addCard(new Y.Mashups.Story(Y.Mashups.Tests.Data.StoriesAsData[3]))
            .addCard(new Y.Mashups.Story(Y.Mashups.Tests.Data.StoriesAsData[4]))
            .addCard(new Y.Mashups.Defect(Y.Mashups.Tests.Data.DefectsAsData[0]))
            .addCard(new Y.Mashups.Defect(Y.Mashups.Tests.Data.DefectsAsData[1]))
            .addCard(new Y.Mashups.Defect(Y.Mashups.Tests.Data.DefectsAsData[2]))
            .addCard(new Y.Mashups.Defect(Y.Mashups.Tests.Data.DefectsAsData[3]))
            .addCard(new Y.Mashups.Defect(Y.Mashups.Tests.Data.DefectsAsData[4]))};

    Y.Mashups.Tests.Data.KanbanSwimlanes = function(){
        return new Y.Mashups.Swimlanes({ service: new Y.Mashups.Stubs.Service() })
                            .addSwimlane(new Y.Mashups.Swimlane({ Name: "Defined", data : { KanbanState: "Defined", ScheduleSate: "Backlog" } }))
                            .addSwimlane(new Y.Mashups.Swimlane({ Name: "Prioritised", data : { KanbanState: "Prioritised", ScheduleSate: "Backlog" }  }))
                            .addSwimlane(new Y.Mashups.Swimlane({ Name: "In Analysis", data : { KanbanState: "In Analysis", ScheduleSate: "Backlog" }  }))
                            .addSwimlane(new Y.Mashups.Swimlane({ Name: "Ready For Development", data : { KanbanState: "Ready For Development", ScheduleSate: "Defined" }  }))
                            .addSwimlane(new Y.Mashups.Swimlane({ Name: "In Development", data : { KanbanState: "In Development", ScheduleSate: "In-Progress" }  }))
                            .addSwimlane(new Y.Mashups.Swimlane({ Name: "Ready For Code Review", data : { KanbanState: "Ready For Code Review", ScheduleSate: "In-Progress" }  }))
                            .addSwimlane(new Y.Mashups.Swimlane({ Name: "In Code Review", data : { KanbanState: "In Code Review", ScheduleSate: "In-Progress" }  }))
                            .addSwimlane(new Y.Mashups.Swimlane({ Name: "Ready For Test", data : { KanbanState: "Ready For Test", ScheduleSate: "In-Progress" }  }))
                            .addSwimlane(new Y.Mashups.Swimlane({ Name: "In Test" , data : { KanbanState: "In Test", ScheduleSate: "In-Progress" } }))
                            .addSwimlane(new Y.Mashups.Swimlane({ Name: "Ready For Acceptance", data : { KanbanState: "Ready For Acceptance", ScheduleSate: "Completed" }  }))
                            .addSwimlane(new Y.Mashups.Swimlane({ Name: "Accepted" , data : { KanbanState: "Accepted", ScheduleSate: "Accepted" } }));
        
    };

    Y.Mashups.Tests.Data.EstimateSwimlanesAsData = new Array(
        { Name: "0", Label: "Free (0)" },
        { Name: "1", Label: "Small (1)" },
        { Name: "2", Label: "Medium (2)"},
        { Name: "3", Label: "Large (3)"},
        { Name: "5", Label: "X-Large (5)"}
    );

    Y.Mashups.Tests.Data.EstimateSwimlanes = function(){
        return new Y.Mashups.Swimlanes({
            swimlaneNotAvailable : new Y.Mashups.Swimlane({ Name: "To Be Estimated", Label: "To Be Estimated"}),
            swimlaneKey: 'PlanEstimate',
            service: new Y.Mashups.Stubs.Service()
        })
           .addSwimlane(new Y.Mashups.Swimlane({ Name: "0", Label: "Free (0)", data : '{ "PlanEstimate": "0" }' }))
           .addSwimlane(new Y.Mashups.Swimlane({ Name: "1", Label: "Small (1)", data : '{ "PlanEstimate": "1" }'}))
           .addSwimlane(new Y.Mashups.Swimlane({ Name: "2", Label: "Medium (2)", data : '{ "PlanEstimate": "2" }'}))
           .addSwimlane(new Y.Mashups.Swimlane({ Name: "3", Label: "Large (3)", data : '{ "PlanEstimate": "3" }'}))
           .addSwimlane(new Y.Mashups.Swimlane({ Name: "5", Label: "X-Large (5)", data : '{ "PlanEstimate": "5" }'}))
           .addSwimlane(new Y.Mashups.Swimlane({ Name: "8", Label: "XX-Large (8)", data : '{ "PlanEstimate": "8" }'}));
    };

},'1.0',{requires: ['base','mashups-swimlane','mashup-stubs']});