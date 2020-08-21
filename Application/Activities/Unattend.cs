using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Unattend
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities.FindAsync(request.Id);
                if (activity == null) throw new RestException(HttpStatusCode.NotFound, new { Activity = "Activity not found" });

                var user = _context.Users.SingleOrDefault(x => x.UserName == _userAccessor.GetCurrentUsername());

                var attendance = _context.UserActivities.SingleOrDefault(x => x.AppUserID == user.Id && x.AcitivityId == activity.Id);
                if (attendance == null) throw new RestException(HttpStatusCode.BadRequest, new { Attendance = "Not attending this activity" });

                if (attendance.IsHost) throw new RestException(HttpStatusCode.BadRequest, new { Attendence = "You cannot remove yourself as host"});
                
                _context.UserActivities.Remove(attendance);

                var success = await _context.SaveChangesAsync() > 0;
                if (success) return Unit.Value;

                throw new Exception("Problem saving changes");
            }
        }
    }
}