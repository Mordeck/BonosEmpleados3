USE [master]
GO
/****** Object:  Database [BonosPlacencia]    Script Date: 01/03/2024 05:51:25 p. m. ******/
CREATE DATABASE [BonosPlacencia]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'BonosPlacencia', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.MASTER\MSSQL\DATA\BonosPlacencia.mdf' , SIZE = 73728KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'BonosPlacencia_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.MASTER\MSSQL\DATA\BonosPlacencia_log.ldf' , SIZE = 73728KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT, LEDGER = OFF
GO
ALTER DATABASE [BonosPlacencia] SET COMPATIBILITY_LEVEL = 160
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [BonosPlacencia].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [BonosPlacencia] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [BonosPlacencia] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [BonosPlacencia] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [BonosPlacencia] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [BonosPlacencia] SET ARITHABORT OFF 
GO
ALTER DATABASE [BonosPlacencia] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [BonosPlacencia] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [BonosPlacencia] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [BonosPlacencia] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [BonosPlacencia] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [BonosPlacencia] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [BonosPlacencia] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [BonosPlacencia] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [BonosPlacencia] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [BonosPlacencia] SET  DISABLE_BROKER 
GO
ALTER DATABASE [BonosPlacencia] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [BonosPlacencia] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [BonosPlacencia] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [BonosPlacencia] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [BonosPlacencia] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [BonosPlacencia] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [BonosPlacencia] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [BonosPlacencia] SET RECOVERY FULL 
GO
ALTER DATABASE [BonosPlacencia] SET  MULTI_USER 
GO
ALTER DATABASE [BonosPlacencia] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [BonosPlacencia] SET DB_CHAINING OFF 
GO
ALTER DATABASE [BonosPlacencia] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [BonosPlacencia] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [BonosPlacencia] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [BonosPlacencia] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
EXEC sys.sp_db_vardecimal_storage_format N'BonosPlacencia', N'ON'
GO
ALTER DATABASE [BonosPlacencia] SET QUERY_STORE = ON
GO
ALTER DATABASE [BonosPlacencia] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO
USE [BonosPlacencia]
GO
/****** Object:  User [wavNoi]    Script Date: 01/03/2024 05:51:25 p. m. ******/
CREATE USER [wavNoi] FOR LOGIN [wavNoi] WITH DEFAULT_SCHEMA=[dbo]
GO
ALTER ROLE [db_owner] ADD MEMBER [wavNoi]
GO
/****** Object:  Table [dbo].[activityConditions]    Script Date: 01/03/2024 05:51:25 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[activityConditions](
	[conditionId] [int] IDENTITY(1,1) NOT NULL,
	[description] [text] NOT NULL,
	[documentId] [int] NOT NULL,
	[positionEvaluator] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[conditionId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[aditionalBonos]    Script Date: 01/03/2024 05:51:25 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[aditionalBonos](
	[adBonoId] [int] IDENTITY(1,1) NOT NULL,
	[documentId] [int] NOT NULL,
	[posEvaluator] [int] NOT NULL,
	[description] [text] NOT NULL,
	[monetaryAmount] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[adBonoId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[aditionalBonos2]    Script Date: 01/03/2024 05:51:25 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[aditionalBonos2](
	[adBonoId] [int] IDENTITY(1,1) NOT NULL,
	[documentId] [int] NOT NULL,
	[description] [text] NOT NULL,
	[monetaryAmount] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[adBonoId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[conditionCriterias]    Script Date: 01/03/2024 05:51:25 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[conditionCriterias](
	[condCriteriaId] [int] IDENTITY(1,1) NOT NULL,
	[conditionId] [int] NULL,
	[description] [text] NOT NULL,
	[weighting] [nchar](40) NOT NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[criterias]    Script Date: 01/03/2024 05:51:25 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[criterias](
	[criteriaId] [int] IDENTITY(1,1) NOT NULL,
	[activityId] [int] NOT NULL,
	[description] [text] NOT NULL,
	[weighting] [int] NOT NULL,
	[typeCriteria] [int] NOT NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[criteriasEvaluation]    Script Date: 01/03/2024 05:51:25 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[criteriasEvaluation](
	[criteriaEvalId] [int] IDENTITY(1,1) NOT NULL,
	[evalId] [int] NOT NULL,
	[criteriaType] [int] NOT NULL,
	[criteriaId] [int] NOT NULL,
	[resultValue] [nchar](60) NOT NULL,
 CONSTRAINT [UQ_evalId] UNIQUE NONCLUSTERED 
(
	[evalId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[criteriaTypes]    Script Date: 01/03/2024 05:51:25 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[criteriaTypes](
	[typeId] [int] IDENTITY(1,1) NOT NULL,
	[typeName] [nchar](60) NOT NULL,
	[unit] [nchar](30) NOT NULL,
	[action] [nchar](50) NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[departments]    Script Date: 01/03/2024 05:51:25 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[departments](
	[departmentID] [int] IDENTITY(1,1) NOT NULL,
	[departName] [nchar](60) NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[DocumentActivity]    Script Date: 01/03/2024 05:51:25 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[DocumentActivity](
	[activityId] [int] IDENTITY(1,1) NOT NULL,
	[documentId] [int] NOT NULL,
	[description] [text] NOT NULL,
	[owner] [int] NOT NULL,
	[applyToPos] [nchar](50) NOT NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[DocumentBonoAuth]    Script Date: 01/03/2024 05:51:25 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[DocumentBonoAuth](
	[documentBonoId] [int] IDENTITY(1,1) NOT NULL,
	[documentId] [int] NOT NULL,
	[employeeId] [int] NOT NULL,
	[monthEvaluated] [date] NOT NULL,
	[average] [float] NULL,
	[authorized] [char](2) NULL,
	[amounth] [int] NULL,
	[userAuth] [char](30) NULL,
	[authDate] [date] NULL,
 CONSTRAINT [UC_DocumentBonoAuth] UNIQUE NONCLUSTERED 
(
	[documentId] ASC,
	[employeeId] ASC,
	[monthEvaluated] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[documentDeductions]    Script Date: 01/03/2024 05:51:25 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[documentDeductions](
	[docDeductionId] [int] IDENTITY(1,1) NOT NULL,
	[documentId] [int] NOT NULL,
	[description] [text] NOT NULL,
	[monetaryAmount] [int] NOT NULL,
	[positionEvaluator] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[docDeductionId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[DocumentfinalAuth]    Script Date: 01/03/2024 05:51:25 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[DocumentfinalAuth](
	[docFinalAuthId] [int] IDENTITY(1,1) NOT NULL,
	[documentId] [int] NOT NULL,
	[positionEvaluator] [int] NOT NULL,
	[authorization] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[docFinalAuthId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Documents]    Script Date: 01/03/2024 05:51:25 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Documents](
	[documentId] [int] IDENTITY(1,1) NOT NULL,
	[nomenclature] [nchar](30) NOT NULL,
	[evalMonth] [nchar](15) NOT NULL,
	[completed] [int] NOT NULL,
	[userRegister] [nchar](30) NOT NULL,
	[dateRegister] [nchar](30) NOT NULL,
	[docDepartment] [nchar](60) NOT NULL,
	[userPosition] [nchar](60) NOT NULL,
	[active] [int] NOT NULL,
	[documentType] [int] NOT NULL,
	[multiEmployee] [nchar](60) NOT NULL,
	[needSalesCapture] [int] NULL,
	[needExpensCapture] [int] NULL,
	[minimunToAuth] [float] NOT NULL,
	[haveToShowSales] [nchar](2) NULL,
	[haveToShowExpens] [nchar](2) NULL,
 CONSTRAINT [PK_documents] PRIMARY KEY CLUSTERED 
(
	[documentId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Documents2]    Script Date: 01/03/2024 05:51:25 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Documents2](
	[documentId] [int] IDENTITY(1,1) NOT NULL,
	[nomenclature] [nchar](30) NOT NULL,
	[evalMonth] [nchar](15) NOT NULL,
	[completed] [int] NOT NULL,
	[userRegister] [nchar](30) NOT NULL,
	[dateRegister] [nchar](30) NOT NULL,
	[docDepartment] [nchar](60) NOT NULL,
	[userPosition] [nchar](60) NOT NULL,
	[active] [int] NOT NULL,
	[documentType] [int] NOT NULL,
	[multiEmployee] [nchar](60) NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Documents3]    Script Date: 01/03/2024 05:51:25 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Documents3](
	[documentId] [int] IDENTITY(1,1) NOT NULL,
	[nomenclature] [nchar](30) NOT NULL,
	[evalMonth] [nchar](15) NOT NULL,
	[completed] [int] NOT NULL,
	[userRegister] [nchar](30) NOT NULL,
	[dateRegister] [nchar](30) NOT NULL,
	[docDepartment] [nchar](60) NOT NULL,
	[userPosition] [nchar](60) NOT NULL,
	[active] [int] NOT NULL,
	[documentType] [int] NOT NULL,
	[multiEmployee] [nchar](60) NOT NULL,
	[needSalesCapture] [int] NULL,
	[needExpensCapture] [int] NULL,
	[minimunToAuth] [float] NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[documentSales]    Script Date: 01/03/2024 05:51:25 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[documentSales](
	[salesId] [int] IDENTITY(1,1) NOT NULL,
	[description] [text] NULL,
	[documentId] [int] NOT NULL,
	[percentage] [float] NOT NULL,
	[posEvaluator] [int] NULL,
	[typeSales] [char](6) NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[documentSales2]    Script Date: 01/03/2024 05:51:25 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[documentSales2](
	[salesId] [int] IDENTITY(1,1) NOT NULL,
	[documentId] [int] NOT NULL,
	[percentage] [float] NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[documentSales3]    Script Date: 01/03/2024 05:51:25 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[documentSales3](
	[salesId] [int] IDENTITY(1,1) NOT NULL,
	[description] [text] NULL,
	[documentId] [int] NOT NULL,
	[percentage] [float] NOT NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[documentSales4]    Script Date: 01/03/2024 05:51:25 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[documentSales4](
	[salesId] [int] IDENTITY(1,1) NOT NULL,
	[description] [text] NULL,
	[documentId] [int] NOT NULL,
	[percentage] [float] NOT NULL,
	[posEvaluator] [int] NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[documentType]    Script Date: 01/03/2024 05:51:25 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[documentType](
	[typeId] [int] IDENTITY(1,1) NOT NULL,
	[description] [nchar](60) NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[employees]    Script Date: 01/03/2024 05:51:25 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[employees](
	[employeeID] [int] NOT NULL,
	[name] [text] NOT NULL,
	[position] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[employeeID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[evalActivityCondition]    Script Date: 01/03/2024 05:51:25 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[evalActivityCondition](
	[conditionId] [int] NOT NULL,
	[finalAmount] [int] NOT NULL,
	[evalMonth] [date] NULL,
	[userAuth] [char](30) NOT NULL,
	[authDate] [date] NOT NULL,
	[employeeId] [int] NOT NULL,
	[criteriaId] [int] NOT NULL,
 CONSTRAINT [UC_evalActivityCondition3] UNIQUE NONCLUSTERED 
(
	[conditionId] ASC,
	[employeeId] ASC,
	[evalMonth] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[evalActivityCondition2]    Script Date: 01/03/2024 05:51:25 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[evalActivityCondition2](
	[conditionId] [int] NOT NULL,
	[finalAmount] [int] NOT NULL,
	[evalMonth] [date] NULL,
	[userAuth] [char](30) NOT NULL,
	[authDate] [date] NOT NULL,
	[employeeId] [int] NOT NULL,
 CONSTRAINT [UC_evalActivityCondition] UNIQUE NONCLUSTERED 
(
	[conditionId] ASC,
	[employeeId] ASC,
	[evalMonth] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[evalAditionalBono]    Script Date: 01/03/2024 05:51:25 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[evalAditionalBono](
	[adId] [int] NOT NULL,
	[auth] [char](3) NULL,
	[userAuth] [char](30) NULL,
	[dateAuth] [date] NULL,
	[employeeId] [int] NULL,
	[evalDate] [date] NULL,
	[amount] [int] NOT NULL,
	[comment] [text] NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[evalAditionalBono2]    Script Date: 01/03/2024 05:51:25 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[evalAditionalBono2](
	[adId] [int] NOT NULL,
	[auth] [int] NOT NULL,
	[userAuth] [char](30) NULL,
	[dateAuth] [date] NULL,
	[amount] [int] NOT NULL,
	[comment] [text] NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[evalCriteriaAverage]    Script Date: 01/03/2024 05:51:25 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[evalCriteriaAverage](
	[documentBonoId] [int] IDENTITY(1,1) NOT NULL,
	[documentId] [int] NOT NULL,
	[employeeId] [int] NOT NULL,
	[monthEvaluated] [date] NOT NULL,
	[average] [float] NULL,
	[authorized] [char](2) NULL,
	[userAuth] [char](30) NULL,
	[authDate] [date] NULL,
	[criteriaId] [int] NOT NULL,
	[evalId] [int] NOT NULL,
 CONSTRAINT [UC_evalCriteriaAverage3] UNIQUE NONCLUSTERED 
(
	[documentId] ASC,
	[employeeId] ASC,
	[monthEvaluated] ASC,
	[evalId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[evalCriteriaAverage2]    Script Date: 01/03/2024 05:51:25 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[evalCriteriaAverage2](
	[documentBonoId] [int] IDENTITY(1,1) NOT NULL,
	[documentId] [int] NOT NULL,
	[employeeId] [int] NOT NULL,
	[monthEvaluated] [date] NOT NULL,
	[average] [float] NULL,
	[authorized] [char](2) NULL,
	[userAuth] [char](30) NULL,
	[authDate] [date] NULL,
	[criteriaId] [int] NOT NULL,
 CONSTRAINT [UC_evalCriteriaAverage] UNIQUE NONCLUSTERED 
(
	[documentId] ASC,
	[employeeId] ASC,
	[monthEvaluated] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[evalCriteriaAverage3]    Script Date: 01/03/2024 05:51:25 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[evalCriteriaAverage3](
	[documentBonoId] [int] IDENTITY(1,1) NOT NULL,
	[documentId] [int] NOT NULL,
	[employeeId] [int] NOT NULL,
	[monthEvaluated] [date] NOT NULL,
	[average] [float] NULL,
	[authorized] [char](2) NULL,
	[userAuth] [char](30) NULL,
	[authDate] [date] NULL,
	[criteriaId] [int] NOT NULL,
	[evalId] [int] NOT NULL,
 CONSTRAINT [UC_evalCriteriaAverage2] UNIQUE NONCLUSTERED 
(
	[documentId] ASC,
	[employeeId] ASC,
	[monthEvaluated] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[evaluationDeductions]    Script Date: 01/03/2024 05:51:25 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[evaluationDeductions](
	[evalDeductionId] [int] IDENTITY(1,1) NOT NULL,
	[docDeductionId] [int] NOT NULL,
	[totalAmount] [int] NOT NULL,
	[employeeId] [int] NOT NULL,
	[evaluatedMonth] [date] NOT NULL,
	[userAuth] [char](30) NOT NULL,
	[dateAuth] [date] NOT NULL,
 CONSTRAINT [UC_evalationDeductions] UNIQUE NONCLUSTERED 
(
	[docDeductionId] ASC,
	[employeeId] ASC,
	[evaluatedMonth] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[evaluationExpenses]    Script Date: 01/03/2024 05:51:25 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[evaluationExpenses](
	[documentId] [int] NOT NULL,
	[employeeId] [int] NOT NULL,
	[monthEvaluated] [date] NOT NULL,
	[monthGoal] [int] NOT NULL,
	[accumulatedGoal] [int] NOT NULL,
	[monthAchieve] [int] NOT NULL,
	[accumulatedAchieve] [int] NOT NULL,
	[condition] [text] NOT NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[evaluationExpenses2]    Script Date: 01/03/2024 05:51:25 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[evaluationExpenses2](
	[evalId] [int] NOT NULL,
	[monthEvaluated] [date] NOT NULL,
	[monthGoal] [int] NOT NULL,
	[accumulatedGoal] [int] NOT NULL,
	[monthAchieve] [int] NOT NULL,
	[accumulatedAchieve] [int] NOT NULL,
	[condition] [text] NOT NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[evaluations]    Script Date: 01/03/2024 05:51:25 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[evaluations](
	[evalId] [int] IDENTITY(1,1) NOT NULL,
	[monthToEvaluate] [date] NOT NULL,
	[posEvaluated] [int] NOT NULL,
	[posEvaluator] [int] NOT NULL,
	[employeeId] [int] NOT NULL,
	[activityId] [int] NOT NULL,
	[finishDate] [date] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[evaluationSales]    Script Date: 01/03/2024 05:51:25 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[evaluationSales](
	[documentId] [int] NOT NULL,
	[employeeId] [int] NOT NULL,
	[monthEvaluated] [date] NOT NULL,
	[monthGoal] [int] NOT NULL,
	[accumulatedGoal] [int] NOT NULL,
	[monthAchieve] [int] NOT NULL,
	[accumulatedAchieve] [int] NOT NULL,
	[authorized] [char](2) NOT NULL,
	[authDate] [date] NULL,
	[userAuth] [char](30) NULL,
	[condition] [text] NOT NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[EvaluationsLog]    Script Date: 01/03/2024 05:51:25 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EvaluationsLog](
	[user] [nchar](20) NOT NULL,
	[monthToEvaluated] [nchar](20) NOT NULL,
	[dateCreated] [date] NOT NULL,
	[activityId] [int] NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[expenses]    Script Date: 01/03/2024 05:51:25 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[expenses](
	[expensId] [int] IDENTITY(1,1) NOT NULL,
	[description] [text] NULL,
	[documentId] [int] NOT NULL,
	[percentage] [float] NOT NULL,
	[posEvaluator] [int] NOT NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[expenses2]    Script Date: 01/03/2024 05:51:25 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[expenses2](
	[expensId] [int] IDENTITY(1,1) NOT NULL,
	[documentId] [int] NOT NULL,
	[percentage] [float] NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[expenses3]    Script Date: 01/03/2024 05:51:25 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[expenses3](
	[expensId] [int] IDENTITY(1,1) NOT NULL,
	[description] [text] NULL,
	[documentId] [int] NOT NULL,
	[percentage] [float] NOT NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[FinishedEvaluations]    Script Date: 01/03/2024 05:51:25 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[FinishedEvaluations](
	[evalId] [int] NOT NULL,
	[evaluated] [int] NOT NULL,
	[finishedDate] [date] NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Module]    Script Date: 01/03/2024 05:51:25 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Module](
	[moduleId] [int] IDENTITY(1,1) NOT NULL,
	[userType] [nchar](30) NOT NULL,
	[view] [nchar](30) NOT NULL,
	[component] [smallint] NOT NULL,
	[ngMaticon] [nchar](30) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[positions]    Script Date: 01/03/2024 05:51:25 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[positions](
	[positionID] [int] IDENTITY(1,1) NOT NULL,
	[posName] [nchar](60) NOT NULL,
	[departmentId] [int] NOT NULL,
 CONSTRAINT [PK_positionID] PRIMARY KEY CLUSTERED 
(
	[positionID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Roles]    Script Date: 01/03/2024 05:51:25 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Roles](
	[roleID] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](50) NOT NULL,
	[description] [nvarchar](50) NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[stores]    Script Date: 01/03/2024 05:51:25 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[stores](
	[storeId] [int] IDENTITY(1,1) NOT NULL,
	[storeName] [nchar](60) NOT NULL,
	[code] [nchar](30) NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Users]    Script Date: 01/03/2024 05:51:25 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Users](
	[userName] [nvarchar](50) NOT NULL,
	[numEmp] [int] NOT NULL,
	[type] [nvarchar](50) NOT NULL,
	[pass] [nvarchar](60) NOT NULL,
	[fCreacion] [date] NOT NULL,
	[lastAccess] [date] NULL,
	[active] [int] NOT NULL,
	[department] [nvarchar](60) NOT NULL,
	[position] [nvarchar](60) NOT NULL,
 CONSTRAINT [UQ2_userName] UNIQUE NONCLUSTERED 
(
	[userName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[activityConditions] ADD  DEFAULT ((0)) FOR [positionEvaluator]
GO
ALTER TABLE [dbo].[criterias] ADD  DEFAULT ((0)) FOR [typeCriteria]
GO
ALTER TABLE [dbo].[criteriaTypes] ADD  DEFAULT ('') FOR [action]
GO
ALTER TABLE [dbo].[documentDeductions] ADD  DEFAULT ((0)) FOR [monetaryAmount]
GO
ALTER TABLE [dbo].[documentDeductions] ADD  DEFAULT ((0)) FOR [positionEvaluator]
GO
ALTER TABLE [dbo].[Documents] ADD  DEFAULT ((1)) FOR [active]
GO
ALTER TABLE [dbo].[Documents] ADD  DEFAULT ((0)) FOR [documentType]
GO
ALTER TABLE [dbo].[Documents] ADD  DEFAULT ((0)) FOR [needSalesCapture]
GO
ALTER TABLE [dbo].[Documents] ADD  DEFAULT ((0)) FOR [needExpensCapture]
GO
ALTER TABLE [dbo].[Documents] ADD  DEFAULT ((0)) FOR [minimunToAuth]
GO
ALTER TABLE [dbo].[Documents] ADD  DEFAULT ('no') FOR [haveToShowSales]
GO
ALTER TABLE [dbo].[Documents] ADD  DEFAULT ('no') FOR [haveToShowExpens]
GO
ALTER TABLE [dbo].[Documents2] ADD  DEFAULT ((1)) FOR [active]
GO
ALTER TABLE [dbo].[Documents2] ADD  DEFAULT ((0)) FOR [documentType]
GO
ALTER TABLE [dbo].[Documents3] ADD  DEFAULT ((1)) FOR [active]
GO
ALTER TABLE [dbo].[Documents3] ADD  DEFAULT ((0)) FOR [documentType]
GO
ALTER TABLE [dbo].[Documents3] ADD  DEFAULT ((0)) FOR [needSalesCapture]
GO
ALTER TABLE [dbo].[Documents3] ADD  DEFAULT ((0)) FOR [needExpensCapture]
GO
ALTER TABLE [dbo].[Documents3] ADD  DEFAULT ((0)) FOR [minimunToAuth]
GO
ALTER TABLE [dbo].[documentSales] ADD  DEFAULT ((0)) FOR [documentId]
GO
ALTER TABLE [dbo].[documentSales] ADD  DEFAULT ('store') FOR [typeSales]
GO
ALTER TABLE [dbo].[documentSales2] ADD  DEFAULT ((0)) FOR [documentId]
GO
ALTER TABLE [dbo].[documentSales3] ADD  DEFAULT ((0)) FOR [documentId]
GO
ALTER TABLE [dbo].[documentSales4] ADD  DEFAULT ((0)) FOR [documentId]
GO
ALTER TABLE [dbo].[evalActivityCondition] ADD  DEFAULT ((0)) FOR [finalAmount]
GO
ALTER TABLE [dbo].[evalActivityCondition2] ADD  DEFAULT ((0)) FOR [finalAmount]
GO
ALTER TABLE [dbo].[evalAditionalBono] ADD  DEFAULT ((0)) FOR [adId]
GO
ALTER TABLE [dbo].[evalAditionalBono] ADD  DEFAULT ((0)) FOR [amount]
GO
ALTER TABLE [dbo].[evalAditionalBono2] ADD  DEFAULT ((0)) FOR [adId]
GO
ALTER TABLE [dbo].[evalAditionalBono2] ADD  DEFAULT ((0)) FOR [auth]
GO
ALTER TABLE [dbo].[evalAditionalBono2] ADD  DEFAULT ((0)) FOR [amount]
GO
ALTER TABLE [dbo].[evaluationDeductions] ADD  DEFAULT ((0)) FOR [totalAmount]
GO
ALTER TABLE [dbo].[evaluationSales] ADD  DEFAULT ('') FOR [authorized]
GO
ALTER TABLE [dbo].[expenses] ADD  DEFAULT ((0)) FOR [documentId]
GO
ALTER TABLE [dbo].[expenses2] ADD  DEFAULT ((0)) FOR [documentId]
GO
ALTER TABLE [dbo].[expenses3] ADD  DEFAULT ((0)) FOR [documentId]
GO
ALTER TABLE [dbo].[Module] ADD  CONSTRAINT [DF_Module_component]  DEFAULT ((0)) FOR [component]
GO
ALTER TABLE [dbo].[conditionCriterias]  WITH CHECK ADD FOREIGN KEY([conditionId])
REFERENCES [dbo].[activityConditions] ([conditionId])
GO
ALTER TABLE [dbo].[DocumentfinalAuth]  WITH CHECK ADD  CONSTRAINT [FK_posEval] FOREIGN KEY([positionEvaluator])
REFERENCES [dbo].[positions] ([positionID])
GO
ALTER TABLE [dbo].[DocumentfinalAuth] CHECK CONSTRAINT [FK_posEval]
GO
ALTER TABLE [dbo].[DocumentfinalAuth]  WITH CHECK ADD  CONSTRAINT [FKdocId] FOREIGN KEY([documentId])
REFERENCES [dbo].[Documents] ([documentId])
GO
ALTER TABLE [dbo].[DocumentfinalAuth] CHECK CONSTRAINT [FKdocId]
GO
USE [master]
GO
ALTER DATABASE [BonosPlacencia] SET  READ_WRITE 
GO
