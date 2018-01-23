#-*- coding: utf-8 -*-

DIRECT_QUERY = {
    "cpu" : """SELECT [MachineName]
                     ,[CounterValue]
                 FROM [Sample_DQuery_CPU]
            """,
    "memory": """SELECT [MachineName]
                       ,[CounterValue]
                   FROM [Sample_DQuery_Memory]
                """,
    "disk": """SELECT [MachineName]
                     ,[InstanceName]
                     ,[CounterValue]
                 FROM [Sample_DQuery_Disk]
            """,
    "case": """SELECT [Case]
                     ,[FailedCase]
                     ,[PendingCase]
                     ,[ProcessingCase]
                 FROM [Sample_DQuery_Case]
            """,
    "wkrpage_case_summary": """SELECT [InstanceName]
                                     ,[CaseAmount]
                                     ,[RejectCase]
                                     ,[FailedCaseAmount]
                                     ,[PendingCaseAmount]
                                     ,[ProcessingCaseAmount]
                                     ,[CompletedCase]
                                     ,[ValidationFailedCase]
                                     ,[CancelledCase]
                                     ,[ReadyCase]
                                 FROM [Sample_DQuery_Wkrpage_Case_Summary_Data]
                                WHERE [InstanceName] = '{}'
                            """,
    "wkrpage_case_list":"""SELECT [InstanceName]
                                 ,[ExecCaseID]
                                 ,[packageID]
                                 ,[PackageName]
                                 ,[Owner]
                                 ,[CaseStatus]
                                 ,[CaseCreatedDate]
                                 ,[SizeOfData]
                                 ,[SizeOfLog]
                                 ,[SumOfDataRecords]
                                 ,[Runtime]
                                 ,[DataRecordsIn]
                                 ,[DataRecordsOut]
                             FROM [Sample_DQuery_Wkrpage_Case_List]
                            WHERE InstanceName = '{}'
                       """,
    "case_page_sankey":{
                      "case": """SELECT [ExecCaseID]
                                       ,[PackageID]
                                       ,[TaskID]
                                       ,[DataTableID]
                                       ,[SourceNode]
                                       ,[CaseName]
                                       ,[DestNode]
                                   FROM [Sample_DQuery_Case_Page_Sankey]
                                  WHERE ExecCaseID = '{}'
                       """,
                       "pkg": """SELECT [ExecCaseID]
                                       ,[PackageID]
                                       ,[TaskID]
                                       ,[DataTableID]
                                       ,[SourceNode]
                                       ,[CaseName]
                                       ,[DestNode]
                                   FROM [Sample_DQuery_Case_Page_Sankey]
                                   WHERE [PackageID] = '{}'
                                     AND ExecCaseID = (select ExecCaseID 
                                                         from [Sample_DQuery_Case_Page_Sankey]
					                                              where PackageID = '{}' LIMIT 1
                                                      )
                       """
                       },
    "case_page_kpi":"""SELECT 
                              [CaseSize]
                             ,[TaskOfMaxVols]
                             ,[FailedTaskNum]
                             ,[DataTableNum]
                         FROM [Sample_DQuery_Case_Page_KPI]
                        WHERE ExecCaseID = '{}'
                    """,
    "unfixed":"""SELECT DISTINCT 
                             [PackageName]
                            ,[PackageOwner]
                            ,[TaskName]
                            ,[TaskCategory]
                            ,[DetailMessage]
                            ,[Fixed]
                            ,[ErrorCategory]
                            ,[Owner]
                            ,[Typical]
                            ,[RootCause]
                            ,[Solution]
                            ,[FollowupAction]
                            ,[OperationDate]
                        FROM [Sample_DQuery_Unfixed]
                   """,
    "accountinfo":"""SELECT [DataSourceCategory]
                           ,[DataSourceName]
                           ,[DatabaseName]
                           ,[Owner]
                           ,[Email]
                           ,[AccountCategory]
                           ,[Account]
                           ,[Password]
                           ,[ExpireDate]
                           ,[IsPeriodLimited]
                           ,[RemaingDays]
                       FROM [Sample_DQuery_AccountInfo]
                   """,
    "manualdelete":"""SELECT [WorkerName]
                            ,[Name]
                            ,[PackageName]
                            ,[CaseCreatedDate]
                            ,[DeletedDate]
                            ,[CaseStatus]
                        FROM [Sample_DQuery_ManualDelete]
                   """,
    "dailytrack":"""
                    SELECT [IndexName]
                          ,[countnum]
                      FROM [Sample_DQuery_DailyTrack]
                     WHERE [RequestType] = '{}'
                 """,
    "dailytrackdetail":{
        "pkgName":"""SELECT [PackageName]
                          ,[PackageOwner]
                          ,[TaskName]
                          ,[TaskCategory]
                          ,[DetailMessage]
                          ,[Fixed]
                          ,[ErrorCategory]
                          ,[Owner]
                          ,[Typical]
                          ,[RootCause]
                          ,[Solution]
                          ,[FollowupAction]
                          ,[OperationDatetime]
                          ,[OperationDate]
                      FROM [Sample_DQuery_DailyTrackDetail]
                     WHERE [PackageName] = '{}'
                  """,
        "cateName":"""SELECT [PackageName]
                          ,[PackageOwner]
                          ,[TaskName]
                          ,[TaskCategory]
                          ,[DetailMessage]
                          ,[Fixed]
                          ,[ErrorCategory]
                          ,[Owner]
                          ,[Typical]
                          ,[RootCause]
                          ,[Solution]
                          ,[FollowupAction]
                          ,[OperationDatetime]
                          ,[OperationDate]
                      FROM [Sample_DQuery_DailyTrackDetail]
                     WHERE [ErrorCategory] = '{}'
                  """
        }
    } 

TREND_QUERY = {
    "cpu" : """SELECT [Machine]
                     ,[slice_time]
                     ,[CounterValue]
                 FROM [Sample_TQuery_Cpu]
            """,
    "memory": """SELECT [Machine]
                       ,[slice_time]
                       ,[CounterValue]
                   FROM [Sample_TQuery_Memory]
              """,
    "disk": """SELECT [Machine]
                     ,[slice_time]
                     ,[InstanceName]
                     ,[CounterValue]
                 FROM [Sample_TQuery_Disk]
            """,
    "casepage_tat":
           {
                "pkg": """SELECT [PackageName]
                                ,[ExecCaseID]
                                ,[CaseCreatedDate]
                                ,[TaskName]
                                ,[TaskGroupName]
                                ,[TaskExecTime]
                                ,[QtyOfTaskData]
                                ,[NumOfRerun]
                            FROM [Sample_TQuery_Casepage_Tat]
                           WHERE [PackageID] = '{}'
                """,
                "case": """SELECT [PackageName]
                                ,[ExecCaseID]
                                ,[CaseCreatedDate]
                                ,[TaskName]
                                ,[TaskGroupName]
                                ,[TaskExecTime]
                                ,[QtyOfTaskData]
                                ,[NumOfRerun]
                            FROM [Sample_TQuery_Casepage_Tat]
                           WHERE [PackageID] = (
                                                select [PackageID]
                                                  from [Sample_TQuery_Casepage_Tat]
                                                 where [ExecCaseID] = '{}' limit 1
                                  )
                           ORDER BY [CaseCreatedDate] ASC
                """
           }
    }